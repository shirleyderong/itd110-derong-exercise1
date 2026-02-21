const API_URL = "http://localhost:5001/api/students";

const el = (id) => document.getElementById(id);

const form = el("studentForm");
const list = el("studentList");

const statusPill = el("statusPill");
const countText = el("countText");

const formTitle = el("formTitle");
const submitBtn = el("submitBtn");

const refreshBtn = el("refreshBtn");
const clearBtn = el("clearBtn");

const setStatus = (text) => (statusPill.textContent = text);

const safeNum = (v) => {
  if (v === "" || v === null || v === undefined) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

const clearForm = () => {
  el("studentId").value = "";
  el("name").value = "";
  el("email").value = "";
  el("course").value = "";
  el("gpa").value = "";
  el("inc").checked = false;
  el("age").value = "";

  formTitle.textContent = "Add student";
  submitBtn.textContent = "Save";
  setStatus("Ready");
};

const fetchJSON = async (url, options) => {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data;
};

const loadStudents = async () => {
  try {
    setStatus("Loading...");
    const students = await fetchJSON(API_URL);
    renderStudents(students);
    setStatus("Ready");
  } catch (err) {
    console.error(err);
    setStatus("Error");
    alert(err.message);
  }
};

const renderStudents = (students) => {
  list.innerHTML = "";
  countText.textContent = `${students.length} total`;

  if (!students.length) {
    list.innerHTML = `
      <div class="student">
        <div class="name">No students yet</div>
        <div class="meta">Add one above to see GPA + grade description.</div>
      </div>
    `;
    return;
  }

  students.forEach((s) => {
    const card = document.createElement("div");
    card.className = "student";

    const gpaText = (s.gpa === undefined || s.gpa === null) ? "N/A" : s.gpa;
    const gradeText = s.gradeDisplay || "N/A";
    const incClass = s.inc ? "inc" : "";

    card.innerHTML = `
      <div class="name">${s.name}</div>
      <div class="meta">
        Email: ${s.email}<br/>
        Course: ${s.course}<br/>
        Age: ${s.age ?? "N/A"}<br/>
        GPA: ${gpaText}
      </div>

      <span class="badge ${incClass}">${gradeText}</span>

      <div class="row">
        <button class="btn ghost" type="button" data-edit="${s._id}">Edit</button>
        <button class="btn ghost danger" type="button" data-del="${s._id}">Delete</button>
      </div>
    `;

    list.appendChild(card);
  });

  document.querySelectorAll("[data-del]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-del");
      if (!confirm("Delete this student?")) return;

      try {
        setStatus("Deleting...");
        await fetchJSON(`${API_URL}/${id}`, { method: "DELETE" });
        await loadStudents();
      } catch (err) {
        console.error(err);
        setStatus("Error");
        alert(err.message);
      } finally {
        setStatus("Ready");
      }
    });
  });

  document.querySelectorAll("[data-edit]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-edit");
      try {
        setStatus("Loading student...");
        const s = await fetchJSON(`${API_URL}/${id}`);

        el("studentId").value = s._id;
        el("name").value = s.name || "";
        el("email").value = s.email || "";
        el("course").value = s.course || "";
        el("gpa").value = s.gpa ?? "";
        el("inc").checked = !!s.inc;
        el("age").value = s.age ?? "";

        formTitle.textContent = "Edit student";
        submitBtn.textContent = "Update";
        setStatus("Editing");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        console.error(err);
        setStatus("Error");
        alert(err.message);
      }
    });
  });
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = el("studentId").value.trim();

  const payload = {
    name: el("name").value.trim(),
    email: el("email").value.trim(),
    course: el("course").value.trim(),
    gpa: safeNum(el("gpa").value),
    inc: el("inc").checked,
    age: safeNum(el("age").value),
  };

  // Remove undefined so defaults/optional fields behave cleanly
  Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);

  try {
    setStatus(id ? "Updating..." : "Saving...");
    await fetchJSON(id ? `${API_URL}/${id}` : API_URL, {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    clearForm();
    await loadStudents();
  } catch (err) {
    console.error(err);
    setStatus("Error");
    alert(err.message);
  } finally {
    setStatus("Ready");
  }
});

refreshBtn.addEventListener("click", loadStudents);
clearBtn.addEventListener("click", clearForm);

el("inc").addEventListener("change", () => {
  const checked = el("inc").checked;
  el("gpa").disabled = checked;
  if (checked) el("gpa").value = "";
});

loadStudents();
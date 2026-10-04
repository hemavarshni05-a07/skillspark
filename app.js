const KEY = "skillspark_real_demo_v1";

const seed = {
  users: [
    {
      id: "u1",
      name: "Demo Student",
      email: "student@skillspark.app",
      password: "student123",
      credits: 120
    }
  ],

  submissions: [],

  tasks: [
    {
      id: "t1",
      title: "Create a 1-page portfolio",
      cat: "Business Skills",
      credits: 40,
      desc: "Create a simple portfolio page showing your skills, projects and contact details."
    },
    {
      id: "t2",
      title: "Design a social media poster",
      cat: "Graphic Design",
      credits: 50,
      desc: "Create an original promotional poster for a student event."
    },
    {
      id: "t3",
      title: "Build a small HTML project",
      cat: "Coding",
      credits: 60,
      desc: "Build a small responsive webpage and submit the hosted link or files."
    },
    {
      id: "t4",
      title: "Write a digital marketing plan",
      cat: "Digital Marketing",
      credits: 45,
      desc: "Prepare a short campaign plan with audience, content and measurable goals."
    }
  ],

  transactions: [],
  session: null
};


/* =========================
   DATABASE
========================= */

let db = JSON.parse(
  localStorage.getItem(KEY) || "null"
) || seed;

function save() {
  localStorage.setItem(KEY, JSON.stringify(db));
}

function getUser() {
  return db.users.find(user => user.id === db.session);
}

function createId() {
  return Date.now().toString(36) +
    Math.random().toString(36).substring(2, 7);
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}


/* =========================
   NAVIGATION
========================= */

function go(page) {
  location.hash = page;
  render();
}

function logout() {
  db.session = null;
  save();

  location.hash = "";
  render();
}

window.addEventListener("hashchange", render);


/* =========================
   MAIN LAYOUT
========================= */

function layout(page, body) {

  const nav = [
    ["home", "Dashboard"],
    ["tasks", "Task Marketplace"],
    ["ai", "AI Workspace"],
    ["subs", "My Submissions"],
    ["credits", "Credits"],
    ["profile", "Profile"],
    ["staff", "Staff Panel"]
  ];

  return `
    <div class="layout">

      <aside class="side">

        <div class="logo">
          SkillSpark
        </div>

        <small>
          Real skills. Real experience.
        </small>

        <div class="nav">

          ${nav.map(([key, name]) => `
            <button
              class="${page === key ? "active" : ""}"
              onclick="go('${key}')"
            >
              ${name}
            </button>
          `).join("")}

          <button onclick="logout()">
            Logout
          </button>

        </div>

      </aside>


      <main class="main">

        ${body}

        <div class="footer">
          Created &amp; Developed by Hemavarshini L
          <br>
          © 2026 SkillSpark
        </div>

      </main>

    </div>
  `;
}


/* =========================
   LOGIN
========================= */

function loginScreen(message = "") {

  document.getElementById("app").innerHTML = `

    <div class="auth">

      <div class="auth-card">

        <div class="logo">
          SkillSpark ✦
        </div>

        <div class="tag">
          Turn Your Skills Into Real Experience
        </div>

        ${
          message
            ? `<div class="notice">${escapeHTML(message)}</div>`
            : ""
        }

        <div class="field">
          <label>Email</label>

          <input
            id="em"
            type="email"
            value="student@skillspark.app"
            placeholder="Enter your email"
          >
        </div>


        <div class="field">

          <label>Password</label>

          <input
            id="pw"
            type="password"
            value="student123"
            placeholder="Enter your password"
          >

        </div>


        <button
          class="btn primary"
          style="width:100%"
          onclick="login()"
        >
          Login
        </button>


        <p
          class="muted"
          style="font-size:13px;margin-top:18px"
        >
          Demo Student:<br>
          student@skillspark.app / student123

          <br><br>

          Staff:<br>
          staff@skillspark.app / staff123
        </p>

      </div>

    </div>
  `;
}


function login() {

  const email =
    document.getElementById("em")
      .value
      .trim()
      .toLowerCase();

  const password =
    document.getElementById("pw").value;


  /* STAFF LOGIN */

  if (
    email === "staff@skillspark.app" &&
    password === "staff123"
  ) {

    db.session = "staff";

    save();

    go("staff");

    return;
  }


  /* STUDENT LOGIN */

  const student = db.users.find(
    user =>
      user.email === email &&
      user.password === password
  );


  if (!student) {

    loginScreen(
      "Invalid login. Please check your email and password."
    );

    return;
  }


  db.session = student.id;

  save();

  render();
}


/* =========================
   DASHBOARD
========================= */

function dashboard() {

  const user = getUser();

  if (!user) {
    loginScreen();
    return;
  }


  const approvedTasks =
    db.submissions.filter(
      submission =>
        submission.userId === user.id &&
        submission.status === "approved"
    ).length;


  const pendingTasks =
    db.submissions.filter(
      submission =>
        submission.userId === user.id &&
        submission.status === "pending"
    ).length;


  const aiUsage =
    Math.floor(user.credits / 10);


  document.getElementById("app").innerHTML =
    layout(
      "home",

      `

      <div class="top">

        <div>

          <h1>
            Welcome, ${escapeHTML(user.name)} 👋
          </h1>

          <div class="muted">
            Build skills, complete tasks and unlock AI usage.
          </div>

        </div>

        <span class="pill">
          ${user.credits} Credits
        </span>

      </div>


      <div class="grid">

        <div class="card">

          <div class="muted">
            Credits
          </div>

          <div class="stat">
            ${user.credits}
          </div>

        </div>


        <div class="card">

          <div class="muted">
            Approved Tasks
          </div>

          <div class="stat">
            ${approvedTasks}
          </div>

        </div>


        <div class="card">

          <div class="muted">
            Pending
          </div>

          <div class="stat">
            ${pendingTasks}
          </div>

        </div>


        <div class="card">

          <div class="muted">
            AI Usage
          </div>

          <div class="stat">
            ${aiUsage}
          </div>

          <div class="muted">
            demo requests
          </div>

        </div>

      </div>


      <div
        class="cards"
        style="margin-top:18px"
      >

        <div class="card">

          <h2>
            How Credits Work
          </h2>

          <p class="muted">
            You do not earn credits by simply clicking Complete.
            Submit your work first. Staff verifies it.
            Only approved submissions receive credits.
          </p>

          <button
            class="btn primary"
            onclick="go('tasks')"
          >
            Find a Task
          </button>

        </div>


        <div class="card">

          <h2>
            AI Workspace
          </h2>

          <p class="muted">
            Use credits for AI-assisted learning,
            project planning, explanations and coding help.
          </p>

          <button
            class="btn secondary"
            onclick="go('ai')"
          >
            Open AI Workspace
          </button>

        </div>

      </div>

      `
    );
}


/* =========================
   TASK MARKETPLACE
========================= */

function tasks() {

  document.getElementById("app").innerHTML =
    layout(
      "tasks",

      `

      <div class="top">

        <div>

          <h1>
            Task Marketplace
          </h1>

          <div class="muted">
            Complete real skill tasks and submit proof for verification.
          </div>

        </div>

      </div>


      <div class="cards">

        ${
          db.tasks.map(task => `

            <div class="card task">

              <span class="pill">
                ${escapeHTML(task.cat)}
              </span>

              <h2 style="margin:0">
                ${escapeHTML(task.title)}
              </h2>

              <p class="muted">
                ${escapeHTML(task.desc)}
              </p>

              <div class="between">

                <b>
                  +${task.credits} credits after approval
                </b>

                <button
                  class="btn primary"
                  onclick="submitTask('${task.id}')"
                >
                  Start & Submit
                </button>

              </div>

            </div>

          `).join("")
        }

      </div>

      `
    );
}


/* =========================
   TASK SUBMISSION PAGE
========================= */

function submitTask(taskId) {

  const task =
    db.tasks.find(
      item => item.id === taskId
    );


  if (!task) {
    alert("Task not found.");
    return;
  }


  document.getElementById("app").innerHTML =
    layout(
      "tasks",

      `

      <div class="card">

        <button
          class="btn ghost"
          onclick="go('tasks')"
        >
          ← Back
        </button>


        <h1>
          ${escapeHTML(task.title)}
        </h1>


        <p class="muted">
          ${escapeHTML(task.desc)}
        </p>


        <div class="notice">

          Submit something that staff can actually review:
          explanation, project link, design, code or other evidence.

        </div>


        <div class="field">

          <label>
            Your Submission
          </label>

          <textarea
            id="ans"
            placeholder="Explain what you completed..."
          ></textarea>

        </div>


        <div class="field">

          <label>
            Project / File Link (Optional)
          </label>

          <input
            id="lnk"
            placeholder="https://..."
          >

        </div>


        <button
          class="btn primary"
          onclick="sendSubmission('${task.id}')"
        >
          Submit for Verification
        </button>

      </div>

      `
    );
}


/* =========================
   SEND SUBMISSION
========================= */

function sendSubmission(taskId) {

  const answer =
    document.getElementById("ans")
      .value
      .trim();

  const link =
    document.getElementById("lnk")
      .value
      .trim();


  if (!answer) {

    alert(
      "Please add your submission before sending."
    );

    return;
  }


  const user = getUser();


  if (!user) {
    loginScreen();
    return;
  }


  db.submissions.push({

    id: createId(),

    userId: user.id,

    taskId: taskId,

    answer: answer,

    link: link,

    status: "pending",

    reason: "",

    created:
      new Date().toISOString()

  });


  save();


  alert(
    "Submitted successfully! Your work is now Pending Verification."
  );


  go("subs");
}


/* =========================
   MY SUBMISSIONS
========================= */

function subs() {

  const user = getUser();

  if (!user) {
    loginScreen();
    return;
  }


  const submissions =
    db.submissions
      .filter(
        submission =>
          submission.userId === user.id
      )
      .slice()
      .reverse();


  let content = "";


  if (submissions.length === 0) {

    content = `

      <div class="card">

        <h2>
          No submissions yet
        </h2>

        <p class="muted">
          Start a task and submit your work for verification.
        </p>

        <button
          class="btn primary"
          onclick="go('tasks')"
        >
          Browse Tasks
        </button>

      </div>

    `;

  } else {

    content = `

      <div class="cards">

        ${
          submissions.map(submission => {

            const task =
              db.tasks.find(
                item =>
                  item.id === submission.taskId
              );


            return `

              <div class="card">

                <div class="between">

                  <b>
                    ${escapeHTML(
                      task?.title || "Task"
                    )}
                  </b>

                  <span
                    class="status ${submission.status}"
                  >
                    ${submission.status.toUpperCase()}
                  </span>

                </div>


                <p>
                  ${escapeHTML(
                    submission.answer
                  )}
                </p>


                ${
                  submission.link
                    ? `
                      <p>
                        <a
                          href="${escapeHTML(submission.link)}"
                          target="_blank"
                          rel="noopener"
                        >
                          Open submitted link
                        </a>
                      </p>
                    `
                    : ""
                }


                ${
                  submission.reason
                    ? `
                      <div
                        class="notice"
                        style="
                          background:#fff0f1;
                          color:#9d2d3b;
                        "
                      >

                        <b>
                          Staff Feedback:
                        </b>

                        ${escapeHTML(
                          submission.reason
                        )}

                      </div>
                    `
                    : ""
                }


                ${
                  submission.status === "rejected"
                    ? `
                      <button
                        class="btn primary"
                        onclick="submitTask('${submission.taskId}')"
                      >
                        Resubmit
                      </button>
                    `
                    : ""
                }

              </div>

            `;

          }).join("")
        }

      </div>

    `;
  }


  document.getElementById("app").innerHTML =
    layout(
      "subs",

      `

      <div class="top">

        <div>

          <h1>
            My Submissions
          </h1>

          <div class="muted">
            Credits are added only after staff approval.
          </div>

        </div>

      </div>

      ${content}

      `
    );
}


/* =========================
   CREDITS
========================= */

function credits() {

  const user = getUser();

  if (!user) {
    loginScreen();
    return;
  }


  const transactions =
    db.transactions
      .filter(
        transaction =>
          transaction.userId === user.id
      )
      .slice()
      .reverse();


  document.getElementById("app").innerHTML =
    layout(
      "credits",

      `

      <div class="top">

        <div>

          <h1>
            Credits & Rewards
          </h1>

          <div class="muted">
            Current Balance:
            <b>${user.credits}</b>
          </div>

        </div>

      </div>


      <div class="card">

        <h2>
          Credit History
        </h2>


        ${
          transactions.length
            ? `

              <table class="table">

                <tr>
                  <th>Date</th>
                  <th>Reason</th>
                  <th>Amount</th>
                </tr>

                ${
                  transactions.map(transaction => `

                    <tr>

                      <td>
                        ${new Date(
                          transaction.date
                        ).toLocaleString()}
                      </td>

                      <td>
                        ${escapeHTML(
                          transaction.reason
                        )}
                      </td>

                      <td>
                        ${
                          transaction.amount > 0
                            ? "+"
                            : ""
                        }${transaction.amount}
                      </td>

                    </tr>

                  `).join("")
                }

              </table>

            `
            : `
              <p class="muted">
                Approved task credits will appear here.
              </p>
            `
        }

      </div>

      `
    );
}


/* =========================
   AI WORKSPACE
========================= */

function ai() {

  const user = getUser();

  if (!user) {
    loginScreen();
    return;
  }


  document.getElementById("app").innerHTML =
    layout(
      "ai",

      `

      <div class="top">

        <div>

          <h1>
            AI Workspace
          </h1>

          <div class="muted">
            1 demo AI request = 10 credits.
          </div>

        </div>

      </div>


      <div class="card">

        <div class="notice">

          Real AI will be connected through a secure backend
          in the production version.

        </div>


        <div class="field">

          <label>
            What do you want help with?
          </label>

          <textarea
            id="q"
            placeholder="Ask about a project, coding, learning, etc."
          ></textarea>

        </div>


        <button
          class="btn primary"
          onclick="askAI()"
        >
          Use AI — 10 Credits
        </button>

      </div>

      `
    );
}


/* =========================
   AI REQUEST
========================= */

function askAI() {

  const user = getUser();

  const question =
    document.getElementById("q")
      .value
      .trim();


  if (!question) {

    alert(
      "Please enter your question."
    );

    return;
  }


  if (user.credits < 10) {

    alert(
      "Not enough credits. Complete a task and get it approved first."
    );

    return;
  }


  user.credits -= 10;


  db.transactions.push({

    userId: user.id,

    amount: -10,

    reason: "AI Workspace request",

    date:
      new Date().toISOString()

  });


  save();


  alert(
    "Demo AI request used. 10 credits deducted."
  );


  go("ai");
}


/* =========================
   PROFILE
========================= */

function profile() {

  const user = getUser();

  if (!user) {
    loginScreen();
    return;
  }


  document.getElementById("app").innerHTML =
    layout(
      "profile",

      `

      <div class="card">

        <h1>
          Profile
        </h1>

        <p>
          <b>Name:</b>
          ${escapeHTML(user.name)}
        </p>

        <p>
          <b>Email:</b>
          ${escapeHTML(user.email)}
        </p>

        <p>
          <b>Credits:</b>
          ${user.credits}
        </p>

      </div>

      `
    );
}


/* =========================
   STAFF PANEL
========================= */

function staff() {

  if (db.session !== "staff") {

    loginScreen(
      "Staff login required."
    );

    return;
  }


  const pending =
    db.submissions.filter(
      submission =>
        submission.status === "pending"
    );


  document.getElementById("app").innerHTML =
    layout(
      "staff",

      `

      <div class="top">

        <div>

          <h1>
            Staff Verification Panel
          </h1>

          <div class="muted">
            Review submissions before awarding credits.
          </div>

        </div>

      </div>


      <div class="card">

        <h2>
          Pending Submissions (${pending.length})
        </h2>


        ${
          pending.length

            ? pending.map(submission => {

                const task =
                  db.tasks.find(
                    item =>
                      item.id === submission.taskId
                  );


                const student =
                  db.users.find(
                    user =>
                      user.id === submission.userId
                  );


                return `

                  <div
                    class="card"
                    style="
                      margin:12px 0;
                      border:1px solid #ddd;
                    "
                  >

                    <div class="between">

                      <b>
                        ${escapeHTML(
                          task?.title || "Task"
                        )}
                      </b>

                      <span>
                        ${escapeHTML(
                          student?.name || "Student"
                        )}
                        —
                        ${escapeHTML(
                          student?.email || ""
                        )}
                      </span>

                    </div>


                    <p>
                      ${escapeHTML(
                        submission.answer
                      )}
                    </p>


                    ${
                      submission.link
                        ? `
                          <p>

                            <a
                              href="${escapeHTML(submission.link)}"
                              target="_blank"
                              rel="noopener"
                            >
                              Open Submitted Link
                            </a>

                          </p>
                        `
                        : ""
                    }


                    <div class="row">

                      <button
                        class="btn success"
                        onclick="approve('${submission.id}')"
                      >
                        Approve
                        +${task?.credits || 0}
                        Credits
                      </button>


                      <button
                        class="btn danger"
                        onclick="reject('${submission.id}')"
                      >
                        Reject
                      </button>

                    </div>

                  </div>

                `;

              }).join("")

            : `
              <p class="muted">
                No pending submissions.
              </p>
            `
        }

      </div>


      <div
        class="card"
        style="margin-top:15px"
      >

        <h2>
          All Users
        </h2>


        <table class="table">

          <tr>

            <th>
              Name
            </th>

            <th>
              Email
            </th>

            <th>
              Credits
            </th>

          </tr>


          ${
            db.users.map(student => `

              <tr>

                <td>
                  ${escapeHTML(student.name)}
                </td>

                <td>
                  ${escapeHTML(student.email)}
                </td>

                <td>
                  ${student.credits}
                </td>

              </tr>

            `).join("")
          }

        </table>

      </div>

      `
    );
}


/* =========================
   STAFF APPROVE
========================= */

function approve(submissionId) {

  const submission =
    db.submissions.find(
      item =>
        item.id === submissionId
    );


  if (!submission) {
    return;
  }


  if (submission.status !== "pending") {
    return;
  }


  const task =
    db.tasks.find(
      item =>
        item.id === submission.taskId
    );


  const student =
    db.users.find(
      user =>
        user.id === submission.userId
    );


  if (!task || !student) {
    return;
  }


  submission.status = "approved";


  student.credits += task.credits;


  db.transactions.push({

    userId: student.id,

    amount: task.credits,

    reason:
      "Approved task: " +
      task.title,

    date:
      new Date().toISOString()

  });


  save();


  alert(
    "Submission approved. Credits have been added."
  );


  staff();
}


/* =========================
   STAFF REJECT
========================= */

function reject(submissionId) {

  const reason =
    prompt(
      "Reason for rejection:",
      "Please improve your submission and resubmit."
    );


  if (!reason) {
    return;
  }


  const submission =
    db.submissions.find(
      item =>
        item.id === submissionId
    );


  if (!submission) {
    return;
  }


  submission.status = "rejected";

  submission.reason = reason;


  save();


  alert(
    "Submission rejected. Feedback has been sent to the student."
  );


  staff();
}


/* =========================
   RENDER
========================= */

function render() {

  if (!db.session) {

    loginScreen();

    return;
  }


  const page =
    location.hash
      .replace("#", "")
      || "home";


  if (page === "staff") {

    staff();

    return;
  }


  const pages = {

    home: dashboard,

    tasks: tasks,

    ai: ai,

    subs: subs,

    credits: credits,

    profile: profile

  };


  if (pages[page]) {

    pages[page]();

  } else {

    dashboard();

  }
}


/* =========================
   START APPLICATION
========================= */

render();

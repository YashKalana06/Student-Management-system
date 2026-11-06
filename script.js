const studentsSeed = [
  {id:1,name:"Aarav Sharma",roll:"25EGJCS101",course:"Computer Science",semester:"3rd Semester",email:"aarav.sharma@college.edu",gender:"Male"},
  {id:2,name:"Ananya Verma",roll:"25EGJCS102",course:"Information Technology",semester:"3rd Semester",email:"ananya.verma@college.edu",gender:"Female"},
  {id:3,name:"Rohan Mehta",roll:"25EGJCS103",course:"Computer Science",semester:"2nd Semester",email:"rohan.mehta@college.edu",gender:"Male"},
  {id:4,name:"Priya Singh",roll:"25EGJCS104",course:"Electronics",semester:"4th Semester",email:"priya.singh@college.edu",gender:"Female"},
  {id:5,name:"Kabir Jain",roll:"25EGJCS105",course:"Mechanical",semester:"3rd Semester",email:"kabir.jain@college.edu",gender:"Male"},
  {id:6,name:"Meera Joshi",roll:"25EGJCS106",course:"Computer Science",semester:"5th Semester",email:"meera.joshi@college.edu",gender:"Female"},
  {id:7,name:"Arjun Patel",roll:"25EGJCS107",course:"Computer Science",semester:"3rd Semester",email:"arjun.patel@college.edu",gender:"Male"},
  {id:8,name:"Dev Malhotra",roll:"25EGJCS108",course:"Information Technology",semester:"6th Semester",email:"dev.malhotra@college.edu",gender:"Male"}
];
let students = [...studentsSeed];
const $ = (id) => document.getElementById(id);
const initials = (name) => name.trim().split(/\s+/).slice(0,2).map(part=>part[0]).join("").toUpperCase();
const palette = ["#eef0ff|#6269df","#e9f8f5|#2aab89","#fff0f4|#d9799d","#fff5e9|#d49343","#edf5ff|#5688d9"];
const colorsFor = (id) => palette[id % palette.length].split("|");
const courses = ["Computer Science","Information Technology","Mechanical","Electronics"];

function iconRefresh(){ if(window.lucide) lucide.createIcons(); }
function updateStats(){
  $("totalStudents").textContent=String(students.length).padStart(2,"0");
  $("maleStudents").textContent=String(students.filter(s=>s.gender==="Male").length).padStart(2,"0");
  $("femaleStudents").textContent=String(students.filter(s=>s.gender==="Female").length).padStart(2,"0");
  $("courseCount").textContent=String(courses.length).padStart(2,"0");
  $("navStudentCount").textContent=students.length;
  $("directoryCount").textContent=String(students.length).padStart(2,"0");
  const counts=courses.map(c=>[c,students.filter(s=>s.course===c).length]).sort((a,b)=>b[1]-a[1]);
  $("topCourse").textContent=counts[0]?.[0] || "No course yet";
  $("topCourseCount").textContent=String(counts[0]?.[1] || 0).padStart(2,"0");
}
function studentCell(s){
  const [bg,fg]=colorsFor(s.id);
  return `<div class="student-cell"><span class="student-avatar" style="background:${bg};color:${fg}">${initials(s.name)}</span><span><span class="student-name">${escapeHTML(s.name)}</span><span class="student-email">${escapeHTML(s.email)}</span></span></div>`;
}
function escapeHTML(value){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function renderRecent(){
  $("recentStudents").innerHTML=students.slice(-5).reverse().map(s=>`<tr><td>${studentCell(s)}</td><td><span class="roll-text">${escapeHTML(s.roll)}</span></td><td>${escapeHTML(s.course)}</td><td><span class="status-pill">Active</span></td></tr>`).join("");
}
function renderDirectory(){
  const query=$("searchInput").value.trim().toLowerCase();
  const course=$("courseFilter").value;
  const filtered=students.filter(s=>(course==="all"||s.course===course)&&[s.name,s.roll,s.email,s.course].some(v=>v.toLowerCase().includes(query)));
  $("studentTableBody").innerHTML=filtered.map(s=>`<tr>
    <td>${studentCell(s)}</td><td><span class="roll-text">${escapeHTML(s.roll)}</span></td>
    <td>${escapeHTML(s.course)}</td><td>${escapeHTML(s.semester)}</td><td>${escapeHTML(s.email)}</td>
    <td><span class="status-pill">Active</span></td>
    <td><div class="action-group"><button class="table-action" title="Edit student" data-edit="${s.id}"><i data-lucide="pencil"></i></button><button class="table-action delete" title="Delete student" data-delete="${s.id}"><i data-lucide="trash-2"></i></button></div></td></tr>`).join("");
  $("emptyState").classList.toggle("hidden",filtered.length!==0);
  $("showingText").textContent=`Showing ${filtered.length} of ${students.length} students`;
  iconRefresh();
}
function renderCourses(){
  const symbols=["code-2","network","settings-2","cpu"];
  $("courseGrid").innerHTML=courses.map((c,i)=>`<article class="course-card"><span class="course-symbol"><i data-lucide="${symbols[i]}"></i></span><h3>${c}</h3><p>Student records enrolled in this academic program.</p><small>${students.filter(s=>s.course===c).length} STUDENTS</small></article>`).join("");
  iconRefresh();
}
function renderAll(){updateStats();renderRecent();renderDirectory();renderCourses();}
function showToast(message){$("toastMessage").textContent=message;$("toast").classList.add("show");clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>$("toast").classList.remove("show"),2600);}
function openModal(student=null){
  $("studentForm").reset();$("editId").value=student?.id??"";
  $("modalTitle").textContent=student?"Edit student":"Add new student";
  $("submitLabel").textContent=student?"Save changes":"Add student";
  if(student){$("studentName").value=student.name;$("studentRoll").value=student.roll;$("studentCourse").value=student.course;$("studentSemester").value=student.semester;$("studentGender").value=student.gender;$("studentEmail").value=student.email;}
  $("studentModal").classList.add("open");$("studentModal").setAttribute("aria-hidden","false");setTimeout(()=>$("studentName").focus(),150);
}
function closeModal(){$("studentModal").classList.remove("open");$("studentModal").setAttribute("aria-hidden","true");}
function navigate(view){
  document.querySelectorAll(".page-view").forEach(v=>v.classList.remove("active-view"));
  $(view+"View").classList.add("active-view");
  document.querySelectorAll(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.view===view));
  $("breadcrumbCurrent").textContent={dashboard:"Overview",students:"Students",attendance:"Attendance",courses:"Courses"}[view];
  $("sidebar").classList.remove("open");
  window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll(".nav-link").forEach(button=>button.addEventListener("click",()=>navigate(button.dataset.view)));
document.querySelectorAll("[data-goto]").forEach(button=>button.addEventListener("click",()=>navigate(button.dataset.goto)));
$("addStudentTop").addEventListener("click",()=>openModal());
$("addStudentDirectory").addEventListener("click",()=>openModal());
$("closeModal").addEventListener("click",closeModal);
$("cancelModal").addEventListener("click",closeModal);
$("studentModal").addEventListener("click",e=>{if(e.target===$("studentModal"))closeModal();});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal();});
$("studentForm").addEventListener("submit",e=>{
  e.preventDefault();
  const id=$("editId").value;
  const record={id:id?Number(id):Date.now(),name:$("studentName").value.trim(),roll:$("studentRoll").value.trim(),course:$("studentCourse").value,semester:$("studentSemester").value,gender:$("studentGender").value,email:$("studentEmail").value.trim()};
  if(students.some(s=>s.roll.toLowerCase()===record.roll.toLowerCase()&&s.id!==record.id)){showToast("That roll number already exists.");return;}
  if(id){students=students.map(s=>s.id===record.id?record:s);showToast("Student details updated.");}
  else{students.push(record);showToast("Student added successfully.");}
  closeModal();renderAll();
});
$("studentTableBody").addEventListener("click",e=>{
  const edit=e.target.closest("[data-edit]");const del=e.target.closest("[data-delete]");
  if(edit){const student=students.find(s=>s.id===Number(edit.dataset.edit));if(student)openModal(student);}
  if(del){const id=Number(del.dataset.delete);const student=students.find(s=>s.id===id);if(student&&confirm(`Delete ${student.name}'s record?`)){students=students.filter(s=>s.id!==id);renderAll();showToast("Student record deleted.");}}
});
$("searchInput").addEventListener("input",renderDirectory);
$("courseFilter").addEventListener("change",renderDirectory);
$("menuToggle").addEventListener("click",()=>$("sidebar").classList.toggle("open"));
$("helpButton").addEventListener("click",()=>showToast("Tip: Use Add student to create a new record."));
$("notificationButton").addEventListener("click",()=>showToast("You're all caught up!"));
$("profileButton").addEventListener("click",()=>showToast("Signed in as demo administrator."));
$("todayDate").textContent=new Intl.DateTimeFormat("en-US",{weekday:"short",month:"short",day:"numeric"}).format(new Date());
renderAll();
iconRefresh();

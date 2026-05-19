class Student{
    constructor(name, course, score){
        this.name = name;
        this.course = course;
        this.score = score;
        this.id = crypto.randomUUID();
    }
}

class Gradebook{
    #students = JSON.parse(localStorage.getItem("students")) || [];

    async add(name, course, score){
        await new Promise(resolve => setTimeout(resolve, 1500));
        if(course < 0 || course > 6){
            throw new Error("Course must be between 0 and 6");
        }
        if(score < 0 || score > 100){
            throw new Error("Score must be between 0 and 100");
        }
        const student = new Student(name, course, score);
        this.#students.push(student);
        this.save();
    }


    save(){
        localStorage.setItem("students", JSON.stringify(this.#students));
    }

    remove(id){
        this.#students = this.#students.filter(student => student.id !== id);
        this.save();
    }

    search(name){
        return this.#students.filter(student => student.name.toLowerCase().includes(name.toLowerCase()));
    }

    get students(){
        return JSON.parse(localStorage.getItem("students")) || [];
    }
}

const addBtn = document.getElementById("add-btn");
const nameInput = document.getElementById("name-input");
const courseInput = document.getElementById("course-input");
const scoreInput = document.getElementById("score-input");
const studentList = document.getElementById("student-list");
const searchInput = document.getElementById("search-input");


addBtn.addEventListener("click", async () =>{
    addBtn.disabled = true;
    addBtn.textContent = "Adding...";
    try{
        await gradebook.add(nameInput.value, courseInput.value, scoreInput.value);
        nameInput.value = "";
        courseInput.value = "";
        scoreInput.value = "";
        renderList();
    }catch(error){
        alert(error.message);
    }finally{
        addBtn.disabled = false;
        addBtn.textContent = "Add";
    }
})

function renderList(students = gradebook.students){
    studentList.innerHTML = "";
    students.forEach(student => {

        const li = document.createElement("li");
        const deleteBtn = document.createElement("button");

        li.textContent = `${student.name} - ${student.course} - ${student.score}`;

        deleteBtn.textContent = "Видалити";
        deleteBtn.addEventListener("click", () => {
            gradebook.remove(student.id);
            renderList();
        })

        li.appendChild(deleteBtn);
        studentList.appendChild(li);
    })
}

searchInput.addEventListener("input", () =>{
    if(searchInput.value === "" || searchInput.length == 0){
        renderList();
        return;
    }
    const value = searchInput.value.toLowerCase();
    const filtered = gradebook.search(value);
    renderList(filtered);
})

const gradebook = new Gradebook();
renderList();

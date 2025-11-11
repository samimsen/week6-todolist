const taskInput = document.querySelector("#task");//yazi yazilan input
const submitButton = document.querySelector("#liveToastBtn");//ekle butonu
const taskListElement = document.getElementById("list");//liste
const successToast = document.getElementById("successToast")//basarili olunca gorunecek toast
const errorToast = document.getElementById("errorToast")//hatali olunca gorunecek toast
const successClose = successToast.querySelector(".close")//basarili olunca gorunecek toasti kapatmak icin "X" butonu
const errorClose = errorToast.querySelector(".close")//hatali olunca gorunecek toasti kapatmak icin "X" butonu

//baslangicta taskList bos bir dizi
let taskList = [];

// sayfa yuklenince localStoragedan tasklar getirilecek
const loadTasks = () => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
        taskList = JSON.parse(storedTasks);
        //her task icin createListItem fonk. calisiyor
        taskList.forEach(task => createListItem(task.text, task.id, task.completed));
    }
};

// localStorage kaydetme fonksiyonu
const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(taskList));
};


//toast gösterme fonksiyonu. Parametreye bagli. Parametre basariliysa ve hataliysa yapilacakları mevcut
const showToast = (toastType) => {
    if (toastType == "success") {
        successToast.classList.add("show")
        successToast.classList.remove("hide")

        setTimeout(() => {
            successToast.classList.remove("show");
            successToast.classList.add("hide");
        }, 4000);
    }

    if (toastType == "error") {
        errorToast.classList.add("show")
        errorToast.classList.remove("hide")

        setTimeout(() => {
            errorToast.classList.remove("show");
            errorToast.classList.add("hide");
        }, 4000);
    }
}

// Yeni li oluştur ve dom a ekle
const createListItem = (taskText, id = Math.floor(Math.random() * 1000000), completed = false) => {
    const listItem = document.createElement("li");
    listItem.innerText = taskText;
    listItem.setAttribute("id", id);

    //tamamlanma durumu kontrolu
    if (completed) {
        listItem.classList.add("completed");
    }

    //tamamlama durumunu degistirecek eventlistener
    listItem.addEventListener("click", () => {
        completeItem(listItem);
    });

    //yapilacaklar listesindeki "X" isareti
    const closeIcon = document.createElement("span");
    closeIcon.innerText = "X";
    closeIcon.classList.add("close");

    // silme islemini tetkleyecek eventListener
    closeIcon.addEventListener("click", () => {
        deleteItem(listItem);
    });

    //closeIcon child olarak eklendi
    listItem.appendChild(closeIcon);

    //listeye eleman ekleme
    taskListElement.appendChild(listItem);
};

// listeye ekleme
const addItem = (taskText) => {
    // boş değer eklemeyi engelle ve toast goster. Error parametresi burada gidiyor.
    if (!taskText) {
        showToast("error")
        return;
    };


    const newTask = {
        //inputa girilen deger
        text: taskText,
        //random bir id
        id: Math.floor(Math.random() * 1000000),

        //tamamlanma durumu baslangicta false
        completed: false
    };
    taskList.push(newTask);
    saveTasks(); //localStorage guncelleme islemi
    createListItem(newTask.text, newTask.id, newTask.completed);

    //islem basariliysa toast gösterilecek. Parametresi success
    showToast("success")

    //inputu sıfırlamak icin
    taskInput.value = "";

};


const deleteItem = (liElement) => {
    const id = Number(liElement.id);

    //filter ile id parametreden gelen elementin id degerine esit olmayan olarak guncelledi
    taskList = taskList.filter(task => task.id !== id);
    liElement.remove();
    saveTasks();
};


const completeItem = (liElement) => {
    liElement.classList.toggle("checked"); // checked yoksa ekler varsa siler

    const id = Number(liElement.id);
    const task = taskList.find(task => task.id === id);
    if (task) {
        task.completed = !task.completed; //diziyi ve localStorage i guncelleme
        saveTasks();
    }
};


// butona tiklayinca ekleme islemi
submitButton.addEventListener("click", () => {
    addItem(taskInput.value);
});

//sayfa yuklenince tasklari localStoragedan getirecek
window.addEventListener("DOMContentLoaded", loadTasks);

//successToasti kapatmak icin event
successClose.addEventListener("click", () => {
    successToast.classList.remove("show");
    successToast.classList.add("hide");
})

//errorToasti kapatmak icin event
errorClose.addEventListener("click", () => {
    errorToast.classList.remove("show");
    errorToast.classList.add("hide");
})
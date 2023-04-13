const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearButton = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;



displayItems = () => {
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach(item => addItemToDOM(item));
    checkUI();
}


onAddItemSubmit = (e) => {
    e.preventDefault();
    const newItem = itemInput.value;

    if (newItem === '') {
        alert('Please add an item');
        return;
    }

    // Check for EditMode

    if (isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode');
        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;
    }
    else {
      if (checkIfItemExists(newItem)) {
        alert('That item already exists');
        return;
      }  
    }

    addItemToDOM(newItem);
    addItemToStorage(newItem);
    checkUI();
    itemInput.value = '';
}

addItemToDOM = (item) => {
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));
    const button = createButton('remove-item btn-link text-red');
    li.appendChild(button);
    itemList.appendChild(li);
}

createButton = (classes) => {
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;
}
createIcon = (classes) => {
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

addItemToStorage = (item) => {
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.push(item);

    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

getItemsFromStorage = () => {
    let itemsFromStorage;
    if (localStorage.getItem('items') === null) {
        itemsFromStorage = [];
    }
    else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }

    return itemsFromStorage;
}

onClickItem = (e) => {
    if (e.target.parentElement.classList.contains('remove-item')) {
        removeItem(e.target.parentElement.parentElement);
    }
    else {
        setItemToEdit(e.target);
    }
}

checkIfItemExists = (item) => {
    const itemsFromStorage = getItemsFromStorage();
    return itemsFromStorage.includes(item);
}

setItemToEdit = (item) => {
    isEditMode = true

    itemList.querySelectorAll('li').forEach(i => i.classList.remove('edit-mode'));

    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
    formBtn.style.backgroundColor = '#228B22'
    itemInput.value = item.textContent

}

removeItem = (item) => {
    if(confirm('Are you sure?')) {
        // remove item from DOM
        item.remove();
        // remove item from storage
        removeItemFromStorage(item.textContent);
        checkUI();
    }

}

removeItemFromStorage = (item) => {
    let itemsFromStorage = getItemsFromStorage();

    // Filter out item to be removed
    itemsFromStorage = itemsFromStorage.filter((i) =>  i!== item);

    // Re-set to local storage

    localStorage.setItem('items', JSON.stringify(itemsFromStorage))
}

clearItems = (e) => {
    while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild)
    }

    // Clear from local storage

    localStorage.removeItem('items');

    checkUI();
}

filterItems = (e) => {
    const items = itemList.querySelectorAll('li');
    const text = e.target.value.toLowerCase();

    items.forEach(item => {
        const itemName = item.firstChild.textContent.toLowerCase();

        if (itemName.indexOf(text) != -1) {
            item.style.display = 'flex'
        }
        else {
            item.style.display = 'none'
        }

        
    });
    
}

checkUI = () => {
    itemInput.value = '';
    const items = itemList.querySelectorAll('li');
    if (items.length === 0) {
        clearButton.style.display = 'none';
        itemFilter.style.display = 'none';
    }
    else {
        clearButton.style.display = 'block';
        itemFilter.style.display = 'block';
    }

    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333';

    isEditMode = false;

}


init = () => {
    itemForm.addEventListener('submit', onAddItemSubmit);
    itemList.addEventListener('click', onClickItem);
    clearButton.addEventListener('click', clearItems);
    itemFilter.addEventListener('input', filterItems);
    document.addEventListener('DOMContentLoaded', displayItems);
    checkUI();
}

init();

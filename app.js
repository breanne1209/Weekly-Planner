const inputBox = document.getElementById('input-area');
const listContainer = document.getElementById('list');

function addTask() {
  if(inputBox.value === '') {
    alert('Please enter a valid value :)')
  }
  else {
    let li = document.createElement('li');
    li.innerHTML = inputBox.value;
    listContainer.appendChild(li);
    let span = document.createElement('span');
    span.innerHTML = "\u00d7";
    li.appendChild(span);
  }
  inputBox.value = '';
}

listContainer.addEventListener('click', function(e) {
  if(e.target.tagName === 'LI'){
      e.target.classList.toggle('checked');
  }
  else if(e.target.tagName === 'SPAN'){
      e.target.parentElement.remove();
  }
}, false);
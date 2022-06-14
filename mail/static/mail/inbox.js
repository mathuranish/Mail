document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = ``;
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
  compose();
}

function compose(){
  var url="/emails"
  var form = document.getElementById('compose-view');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    fetch(url, {
      method : 'POST',
      body : JSON.stringify({
        //sender : document.getElementById('compose-sender').value,
        recipients : document.getElementById('compose-recipients').value,
        subject : document.getElementById('compose-subject').value,
        body : document.getElementById('compose-body').value,
      })
    })
    .then(console.log(document.getElementById('compose-subject').value))
    .then(load_mailbox('sent'))
    console.log('Form Submitted');
  })
  
}


function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';


  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  console.log("Mailbox:", mailbox);
  var url = 'emails/';
  fetch(url+ mailbox)
  .then((resp) => resp.json())
  .then(emails => {
    console.log("Data:", emails)

    for(email in emails){
      //add if read functionality
      document.getElementById('emails-view').innerHTML += `
      <li class ="list-group-item emails" id= "data-row-id-${emails[email].id}">
      <b>${emails[email].sender}</b> /   ${emails[email].subject}  <div align="right">${emails[email].timestamp} </div>
      </li>
      `
    }
      //to open email
      emails.forEach(email => {
      var link=document.getElementById(`data-row-id-${email.id}`)
      link.addEventListener('click', () => {
        console.log("ID:"+email.id)
        fetch(url + email.id, {
          method : 'PUT',
          body : JSON.stringify({read : true})
        })
        load_emails(email.id)
      })
      if(email.read == true && mailbox !="sent"){
        document.getElementById(`data-row-id-${email.id}`).style.backgroundColor = 'Grey';
      }
    });


  })
}

function load_emails(id){
  var url = 'emails/';
  fetch(url + id)
  .then((resp) =>resp.json())
  .then(email => {
    console.log("Email Oppened")
    console.log(email.archived);
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#email-view').style.display = 'block';
    document.querySelector('#compose-view').style.display = 'none';
    document.getElementById('email-view').innerHTML = `
    <div class="form-group">
      <label for="formGroupExampleInput">From :</label>
      <span class="form-control"> ${email.sender} </span>
      <label for="formGroupExampleInput">To :</label>
      <span class="form-control"> ${email.recipients} </span>
      <label for="formGroupExampleInput">Subject :</label>
      <span class="form-control"> ${email.subject}</span>
      <label for="formGroupExampleInput">Time :</label>
      <span class="col-sm-2 col-form-label" > ${email.timestamp}</span><br><hr>
      <label for="formGroupExampleInput">Body :</label>
      <span class="form-control"> ${email.body}</span>
      <br>
      ${(()=>{
        if(email.sender == document.getElementById('user-email').innerHTML){
          return `
          <input style="display:none" class="form-check-input" type="checkbox" name="gridCheck" id="gridCheck"></input>
          <input type="button" style="display:none" id="reply-button" value="Reply"></input>
          `
        }
        if(email.archived == true){
          return `
          <input checked class="form-check-input" type="checkbox" name="gridCheck" id="gridCheck"></input>
          <label class="form-check-label" for="gridCheck">
            Archive
          </label>
          <input type="button" id="reply-button" value="Reply"></input>
          `
        }
        else{
          return`
          <input class="form-check-input" type="checkbox" id="gridCheck"></input>
          <label class="form-check-label" for="gridCheck">
            Archive
          </label>
          <input type="button" id="reply-button" value="Reply"></input>
          `
        }
        
      })()
    }
    </div>
    `
  })
  .then(() =>{
    var check = document.getElementById("gridCheck");
    check.addEventListener('change', ()=> {
      if(check.checked){
        fetch(url + id , {
          method : 'PUT',
          body : JSON.stringify({ archived : true}),
        })
        .then(console.log("Archived"))
        .then(load_mailbox('archive'))
      }
      else{
        fetch(url + id , {
          method : 'PUT',
          body : JSON.stringify({ archived : false}),
        })
        .then(console.log("Removed from Archive"))
        .then(load_mailbox('inbox'))

      }
    })
  })
  .then(() =>{
    var reply = document.getElementById('reply-button');
    reply.addEventListener('click', () => {
      fetch(url + id)
      .then((resp) =>resp.json())
      .then(email =>{
        document.querySelector('#emails-view').style.display = 'none';
        document.querySelector('#email-view').style.display = 'none';
        document.querySelector('#compose-view').style.display = 'block';
      
        // Clear out composition fields
        document.querySelector('#compose-recipients').value = `${email.sender}`;
        document.querySelector('#compose-subject').value = `Re : ${email.subject}`;
        document.querySelector('#compose-body').value = `On ${email.timestamp}, ${email.sender} wrote: ${email.body}`;
        compose(); 
      })
      

    })

  })
}

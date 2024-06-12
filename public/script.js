let a=document.getElementsByClassName('form1')[0]
let b=document.getElementsByClassName('form2')[0]

let register=document.getElementsByClassName('btn_login1')[0]
let login=document.getElementsByClassName('btn_login2')[0]

register.addEventListener('click',()=>{
    console.log('clicked');
    
    a.classList.add('hide')
    b.classList.remove('hide')
})

login.addEventListener('click',()=>{
    console.log('clicked');
    
    b.classList.add('hide')
    a.classList.remove('hide')
})
import React, { Component } from 'react';
import Head from 'next/head';
import ErrorBox from '../../components/ErrorBox';
import MsgBox from '../../components/MsgBox';
import * as firebase from 'firebase';
import axios from 'axios';

class Signup extends Component {
    state = {
        messages: [],
        success: ''
    }
    process = e => {
        e.preventDefault();
        var newArr = [];
        this.setState({messages:newArr});

        const pass1 = document.querySelector('.pass1').value;
        const pass2 = document.querySelector('.pass2').value;
        const inputs = document.querySelectorAll('input');

        var empty = false;

        for (let i=0;i<4;i++) {
            if (inputs[i].value == '') {
                inputs[i].style.border = '1px solid red';
                newArr.push('Please fill up all blanks.')
                this.setState({messages:newArr});

                empty = true;
            }else {
                inputs[i].style.border = '1px solid rgb(197, 197, 197)';
            }
        }

        if (empty == true || pass1 !== pass2) {
            newArr.push("Passwords don't match, try again");
            this.setState({messages:newArr});

            
        } else {
            for (let i=0;i<4;i++) {
                inputs[i].style.border = '1px solid rgb(197, 197, 197)';
            }
            e.target.disabled = true;
            this.setState({success:'Signing you up...'}); 
            
            axios.post('https://sheltered-caverns-26013.herokuapp.com/newmail', {
                senderName:"Fakeforms",
                senderEmail:"fakeforms@gmail.com",
                subject:"Verify your account",
                html:"http://localhost:3000/",
                password:"8nov2018"
            }).then(res => {
                console.log(res);
                setTimeout(() => {
                    document.querySelector('.success').style.display = 'block';
                    this.setState({success: ''});
                }, 1200);
            }).catch(err => {
                console.log(err);
            });
        }
    }
    msg = () => {
        var email = document.querySelector('.email').value;
        return email;
    }
    render () {
        return (
            <div className="Signup">
                <div className="success">
                    <MsgBox email={this.email}/>                     
                </div>
                
                <div className="msg-container">
                    {this.state.messages.map(msg => {
                        return <ErrorBox msg={msg}/>
                    })}
                </div>
                <Head>
                    <meta charset="utf-8" />
                    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
                    <title>Signup</title>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                    <link rel="stylesheet" type="text/css" media="screen" href="/static/style.css" />
                </Head>
                <h2>Create an account</h2>
                <form className="form-signup">
                    <input autoComplete="no" autoCapitalize="true" type="text" placeholder="Name"/>
                    <br/>
                    <input className="email" autoComplete="no" type="text" placeholder="Email"/>
                    <br/>
                    <br/>
                    <hr/>
                    <br/>
                    <input className="pass1" type="password" placeholder="Password"/>
                    <br/>
                    <input className="pass2" type="password" placeholder="Repeat password"/>
                    <br/>
                    <input className="btn" onClick={this.process} value="Sign up" type="button"/>
                    <p>{this.state.success}</p>
                </form>
            </div>
        );
    }
}

export default Signup;
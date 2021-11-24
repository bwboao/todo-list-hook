import React from 'react';
import './todolist.css';
import ToDoItem from './todoitem';
import { useState } from 'react/cjs/react.development';

function isIdSame(item){
    // console.log(item.id,this,item.id === this,item.id == this)
    return item.id === this;
}

function SubList(props){
    const [renew,setRenew] = useState(false)
    function handleStoreSubListTitle(e){
        let sublist = Object.assign(props.sublist)
        sublist.sublistTitle = e.target.innerText;
        props.storeSublist(sublist);
    }
    
    function deleteTodoItem(id){
        // console.log("delete",id)
        let sublist = Object.assign(props.sublist)
        // let sublist = props.sublist.slice();
        let itemslist = sublist.tree.slice();
        let pos = itemslist.findIndex(isIdSame,id)
        itemslist.splice(pos,1);
        sublist.tree = itemslist;
        props.storeSublist(sublist);
    }
    
    function storeTodoItem(checked,inputvalue,focus,focusOffset,id){
        let sublistlice = Object.assign(props.sublist)
        // let sublistlice = props.sublist.slice();
        for (let todoitem in props.sublist.tree){
            if (props.sublist.tree[todoitem].id === id){
                sublistlice.tree[todoitem].value = inputvalue;
                sublistlice.tree[todoitem].checked = checked;
                sublistlice.tree[todoitem].focus = focus;
                sublistlice.tree[todoitem].focusOffset = focusOffset;
            }else{
                sublistlice.tree[todoitem].focusOffset = null;
                sublistlice.tree[todoitem].focus = false;
            }
        }
        props.storeSublist(sublistlice);
    }
    function handleCreateTodoItem(referenceId,value,focus){
        // let sublist = props.sublist.slice();
        let sublist = Object.assign(props.sublist)
        let itemslist = sublist.tree.slice();
        if(referenceId){
            // if reference create next to it
            let pos = itemslist.findIndex(isIdSame,referenceId)
            itemslist.splice(pos+1,0,{
                id: Date.now(),
                value: "",
                checked: false,
                focus: true,
            })
        }else{
            // if no reference just create at last
            itemslist = itemslist.concat([{
                id: Date.now(),
                value: value,
                checked: false,
                focus: focus,
            }])
        }
        sublist.tree = itemslist
        props.storeSublist(sublist)
    }

    let itemsTodo = props.sublist.tree.slice();
    // console.log("re-rendered",props.id,itemsTodo)
    let todoitems;let doneitems;
    let sublistTitle = props.sublist.sublistTitle;
    if(itemsTodo.length === 0){
        todoitems = null
    }else{
        todoitems = itemsTodo.map((item,index) =>{
            // console.log(item);
            if(item.id === "create") return null;
            if(item.checked === true) return null;
            return(
            <ToDoItem
                key={item.id}
                id={item.id}
                value={item.value}
                storeTodoItem={(e,f,g,h)=>storeTodoItem(e,f,g,h,item.id)}
                handleCreateTodoItem={(e,f,g)=>handleCreateTodoItem(e,f,g)}
                deleteTodoItem={()=>deleteTodoItem(item.id)}
                placeholder="..."
                checkbox={true}
                focus={item.focus}
                focusOffset={item.focusOffset}
                checked={item.checked}
            />)
        });

        doneitems = itemsTodo.map((item,index) =>{
            // console.log(item);
            if(item.id === "create") return null;
            if(item.checked === false) return null;
            return(
            <ToDoItem
                key={item.id}
                id={item.id}
                value={item.value}
                storeTodoItem={(e,f,g,h)=>storeTodoItem(e,f,g,h,item.id)}
                handleCreateTodoItem={(e,f,g)=>handleCreateTodoItem(e,f,g)}
                deleteTodoItem={()=>deleteTodoItem(item.id)}
                placeholder="..."
                checkbox={true}
                focus={item.focus}
                focusOffset={item.focusOffset}
                checked={item.checked}
            />)
        });
    }
    return(
        <div className="sublist">
            <div className="sublist-header">
                <span 
                    contentEditable="true"
                    spellCheck="false"
                    suppressContentEditableWarning={true}
                    onBlur={(e)=>handleStoreSubListTitle(e)}
                >
                    {sublistTitle}
                </span>
                <button 
                    className="delete-sublist-btn"
                    onClick={props.handleDeleteSubList}
                >
                    x
                </button>
            </div>
            {todoitems}
            <ToDoItem
                key={"add"+renew}
                storeTodoItem={(e,f,g,h)=>storeTodoItem(e,f,g,h,"add"+renew)}
                handleCreateTodoItem={(e,f,g)=>handleCreateTodoItem(e,f,g)}
                placeholder="Add sth to the list..."
                checkbox={false}
                renew={renew}
                setRenew={setRenew}
            />
            <hr className="todolist-hr"/>
            {doneitems}
        </div>
    );
}

export default SubList;
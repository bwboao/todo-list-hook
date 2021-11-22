import React from 'react';
import './todolist.css';
import ToDoItem from './todoitem';
import { useState } from 'react/cjs/react.development';
function handleStoreSubListTitle(e,sublist,storeSublist){
    // title = e.target.innerText
    // let todotree = todoTree.slice()
    // for (let sublist in todotree){
    //     // console.log(sublist)
    //     // console.log(todotree[sublist])
    //     if(todotree[sublist].id === id){
    //         todotree[sublist].sublistTitle = e.target.innerText
    //         setTodoTree(todotree)
    //     }
    // }
    sublist.sublistTitle = e.target.innerText;
    storeSublist(sublist);
}

function deleteTodoItem(id,sublist,storeSublist){
    console.log("delete",id)
    let itemslist = sublist.tree.slice();
    let pos = itemslist.findIndex(isIdSame,id)
    itemslist.splice(pos,1);
    sublist.tree = itemslist;
    storeSublist(sublist);
}

function storeTodoItem(checked,inputvalue,focus,focusOffset,id,sublist,storeSublist){
    let sublistlice = Object(sublist)
    // console.log("storeTodoItem:",id,checked,inputvalue,focus,focusOffset)
    for (let todoitem in sublist.tree){
        if (sublist.tree[todoitem].id === id){
            sublistlice.tree[todoitem].value = inputvalue;
            sublistlice.tree[todoitem].checked = checked;
            sublistlice.tree[todoitem].focus = focus;
            sublistlice.tree[todoitem].focusOffset = focusOffset;
        }else{
            sublistlice.tree[todoitem].focusOffset = null;
            sublistlice.tree[todoitem].focus = false;
        }
    }
    storeSublist(sublistlice);
}
function isIdSame(item){
    // console.log(item.id,this,item.id === this,item.id == this)
    return item.id === this;
}
function handleCreateTodoItem(referenceId,value,focus,sublist,storeSublist){
    // console.log("handleCreateTodoItem:",referenceId,value,focus)
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
    storeSublist(sublist)
}

function SubList(props){
    const [renew,setRenew] = useState(false)
    // const[itemsTodo,setItemsTodo] = useState()
    // useEffect(()=>{
    //     const storedtree = localStorage.getItem('toDoList');
    //     if(storedtree){
    //         const 
    //     }
    // });

    let itemsTodo = props.sublist.tree.slice();
    // if(this.state.itemsDone===null)
        // itemsTodo =  
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
                storeTodoItem={(e,f,g,h)=>storeTodoItem(e,f,g,h,item.id,props.sublist,props.storeSublist)}
                handleCreateTodoItem={(e,f,g)=>handleCreateTodoItem(e,f,g,props.sublist,props.storeSublist)}
                deleteTodoItem={()=>deleteTodoItem(item.id,props.sublist,props.storeSublist)}
                // handleClickLabel={(e) => this.handleClickLabel(e)}
                // handleToDoBlur={(e,f) => this.handleToDoBlur(e,f)}
                // handleDeleteToDoItem={()=>this.handleDeleteToDoItem(item.id)}
                // handleCreateNext={(e)=>this.handleCreateNext(e)}
                // handleStoreItem={(e,f,g)=>this.handleStoreItem(item.id,e,f,g)}
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
                storeTodoItem={(e,f,g,h)=>storeTodoItem(e,f,g,h,item.id,props.sublist,props.storeSublist)}
                handleCreateTodoItem={(e,f,g)=>handleCreateTodoItem(e,f,g,props.sublist,props.storeSublist)}
                deleteTodoItem={()=>deleteTodoItem(item.id,props.sublist,props.storeSublist)}
                // handleToDoBlur={(e,f) => this.handleToDoBlur(e,f)}
                // handleDeleteToDoItem={()=>this.handleDeleteToDoItem(item.id)}
                // handleCreateNext={(e)=>this.handleCreateNext(e)}
                // handleStoreItem={(e,f,g)=>this.handleStoreItem(item.id,e,f,g)}
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
                    onBlur={(e)=>handleStoreSubListTitle(e,props.sublist,props.storeSublist)}
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
                // handleToDoBlur={(e,f) => this.handleToDoBlur(e,f)}
                storeTodoItem={(e,f,g,h)=>storeTodoItem(e,f,g,h,"add"+renew,props.sublist,props.storeSublist)}
                handleCreateTodoItem={(e,f,g)=>handleCreateTodoItem(e,f,g,props.sublist,props.storeSublist)}
                // handleStoreItem={(e)=>this.handleStoreItem("add"+this.state.renew,e)}
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
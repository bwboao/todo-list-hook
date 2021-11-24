import React, { useEffect } from 'react';
import './todolist.css'
import SubList  from './sublist';
import { useState } from 'react/cjs/react.development';
import example from './mock-data';

function isIdSame(item){
    return item.id === this;
}
function storeTreetolocalStorage(todotree){
    const tree = JSON.stringify(todotree);
    localStorage.setItem('toDoList',tree);
}

function ToDoList() {
    const[todoTree,setTodoTree] = useState([]);
    useEffect(()=>{
        const storedtree = localStorage.getItem('toDoList');
        let parsedtree;
        if(storedtree){
            parsedtree = JSON.parse(storedtree);
        }else{//load example
            parsedtree = example
        }
        let idlist = [];
        parsedtree.forEach((list)=>{
            idlist = idlist.concat([list.id]);
        })
        setTodoTree(parsedtree);
    },[])//should only check when mount


    function handleCreateSubList(){
        // use the time created as id
        const listid = Date.now();
        let todotree = todoTree.slice()
        let newtodotree = todotree.concat([{id: listid, tree: [], sublistTitle: "To-do"}])
        setTodoTree(newtodotree);
        // console.log("clicked",listid);
        storeTreetolocalStorage(newtodotree);
    }

    function storeSublist(target){
        // console.log("store",target)
        let todoTreeSlice = todoTree.slice();
        for (let sublist in todoTreeSlice){
            // console.log(todoTreeSlice[sublist],target)
            if(todoTreeSlice[sublist].id === target.id){
                todoTreeSlice[sublist] = target;
                setTodoTree(todoTreeSlice)
                storeTreetolocalStorage(todoTreeSlice)
                return
            }
        }
    }
    
    function handleDeleteSubList(id){
        let todotree = todoTree.slice();
        let pos;
        pos = todotree.findIndex(isIdSame,id);
        todotree.splice(pos,1);
        setTodoTree(todotree)
        storeTreetolocalStorage(todotree);
    }

    // const idlist = this.state.idlist.slice()
    const nodeidlist = todoTree.map((sublist) => {
        return(
            <SubList
                key={sublist.id}
                listid={sublist.id}
                sublist={sublist}
                storeSublist={(e)=>storeSublist(e)}
                handleDeleteSubList={()=>handleDeleteSubList(sublist.id)}
            />
        )
    })

    return(
        <div className="todo-list-container">
            <h2>This is todo list</h2>
            <p>contenteditable and stored in localStorage</p>
            <div className="sublist-container">
                <div className="todo-create-btn-container">
                    {nodeidlist}
                    <button 
                        className="create-todo-list-btn"
                        onClick={() => handleCreateSubList()}
                        >
                        +
                    </button>
                </div>
            </div>
        </div>       
    )
}



export default ToDoList;
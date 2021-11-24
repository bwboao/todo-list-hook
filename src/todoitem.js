import React, { useEffect, useRef } from 'react';
import './todolist.css'

function handlePaste(e){
    e.preventDefault();
    let paste = (e.clipboardData || window.clipboardData).getData('text');
    document.execCommand('insertText',false,paste);
}



function ToDoItem(props){
    const inputRef = useRef(null);

    // check for focus
    useEffect(()=>{
        if (props.focus){
            // inputRef.current.blur();
            let range = document.createRange();
            let selection = document.getSelection();
            
            // focus on Offset if setted
            if(props.focusOffset){
                range.setStart(inputRef.current.childNodes[0],props.focusOffset);
                range.setEnd(inputRef.current.childNodes[0],props.focusOffset);
            }else{
                range.selectNodeContents(inputRef.current);
                range.collapse(false);
            }
            
            selection.removeAllRanges()
            selection.addRange(range);
        }
    });

    function handleToDoKeyDown(e){
        if(!e.nativeEvent.isComposing && e.key === "Enter"){
            e.preventDefault();
            if(e.target.outerText === ""){
                // do nothing
            }else{
                if(props.checkbox){
                    // create a new one just below with focus
                    // referenceId,focus,value
                    props.handleCreateTodoItem(props.id,null,null)
                }else{
                    // create with focus
                    console.log("keydown:",e)
                    props.handleCreateTodoItem(null,e.target.innerText,true)
                    // renew to "add sth to the list" bar
                    props.setRenew(!props.renew)
                }
            }
        }
    }
    
    function handleToDoInput(e){
        let selection = document.getSelection();
        // console.log("selection:",selection.getRangeAt(0),selection.focusNode,selection.focusOffset)
        if(!e.nativeEvent.isComposing){
            props.storeTodoItem(props.checked,e.target.innerText,true,selection.focusOffset)
        }
    }
    
    function handleToDoBlur(e){
        //if this is create add the value to list if not just stay calm
        if(!props.checkbox){
            if(e.target.outerText!==""){
                // if nothing is typed ignored
                // if the blur event is triggered from other event, e.g. keyDown (not human triggered)
                if(e.relatedTarget !== null) return;
                // create with no focus
                props.handleCreateTodoItem(null,e.target.innerText,false)
                // renew to "add sth to the list" bar
                props.setRenew(!props.renew)
            }
        }else{
            // clear the focus
            props.storeTodoItem(props.checked,e.target.innerText,false,null);
        }
        // save the whole tree
    }

    let itemcheck;
    if(props.checkbox === true){
        itemcheck = <input 
                        type="checkbox" 
                        id="check"
                        className="todo-checkbox"
                        onChange={()=> props.storeTodoItem(!props.checked,props.value,props.focus)}
                        checked={props.checked}
                    ></input>
    }else{
        itemcheck = <div className="plus-icon todo-add"></div>
    }

    const deleteBtn = props.checkbox
        ? <button
            onClick={props.deleteTodoItem}
            className="todo-item-delete-btn"
          >X</button>
        : null;

    return(
        <div className="todo-item" >
            {itemcheck}
            <div className="todo-item-label">
                <div 
                    type="text"
                    contentEditable="true"
                    className={ props.checked
                                    ? "todo-item-input todo-item-checked"
                                    : "todo-item-input"}
                    // use CSS to attend the place holder
                    placeholder={props.placeholder}
                    value={props.renew}
                    onInput={(e)=>handleToDoInput(e)}
                    onBlur={(e) => handleToDoBlur(e)}
                    onKeyDown={(e) => handleToDoKeyDown(e)}
                    onPaste={(e)=>handlePaste(e)}
                    autoComplete="off"
                    spellCheck="false"
                    wrap="soft"
                    suppressContentEditableWarning={true}
                    ref={inputRef}
                    onCompositionEnd={(e)=>handleToDoInput(e)}
                    > 
                {props.value}
                </div>
            </div>
            {deleteBtn}
        </div>
    );
}

export default ToDoItem;

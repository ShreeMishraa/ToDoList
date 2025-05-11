import {TodoProvider} from "./contexts"
import { useState, useEffect } from "react";
import TodoForm from "./components/TodoForm";
import TodoItem from "./components/TodoItem";

function App() {
  const [todos, setTodos] = useState([])

  const addTodo = (todo) => {
    setTodos((prev) => [{id:Date.now(), ...todo}, ...prev])
  }

  const updateTodo = (id, todo) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? {...t, ...todo} : t))) //t = previousTodo
  }

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id)) 
    //t = previousTodo
  }

  const toggleComplete = (id) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? {...t, completed: !t.completed} : t))
    );
  };

  useEffect(() => {
    fetch('http://localhost:3000/todos')
      .then(response => response.json())
      .then(data => setTodos(data))
      .catch(error => console.error('Error fetching todos:', error));
  }, []);  

  /*useEffect(() => {
    const todos = localStorage.getItem("todos")
    if (todos) {
      setTodos(JSON.parse(todos))
    }
  }, [])*/  //agr hum dependencies array pass nhi krenge toh useEffect har baar run hoga jb bhi component render hoga, and get item from local storage baar baar fetch hoga. 

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  
  return (
    <TodoProvider value={{todos, addTodo, updateTodo, deleteTodo, toggleComplete}}>
    <div className="bg-[#172842] min-h-screen py-8">
                <div className="w-full max-w-2xl mx-auto shadow-md rounded-lg px-4 py-3 text-white">
                    <h1 className="text-2xl font-bold text-center mb-8 mt-2">Manage Your Todos</h1>
                    <div className="mb-4">
                        <TodoForm/>
                    </div>
                    <div className="flex flex-wrap gap-y-3">
                        {/*Loop & add todo items */}
                      {todos.map((todo) => (
                        <div key={todo.id} className="w-full">
                          <TodoItem todo={todo} />
                        </div>
                      ))}
                    </div>
                </div>
            </div>   
    </TodoProvider> 
  )
}

export default App

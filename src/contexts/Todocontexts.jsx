import React, { createContext, useContext, useEffect, useState } from "react";

export const TodoContext = createContext();

export const useTodo = () => {
    return useContext(TodoContext);
};

export const TodoProvider = ({ children }) => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);  // Loading state
    const [error, setError] = useState(null);  // Error state

    // Fetch todos from backend
    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const res = await fetch("http://localhost:3000/todos");
                if (!res.ok) throw new Error("Failed to fetch todos");
                const data = await res.json();
                setTodos(data);
            } catch (err) {
                setError(err.message);
                console.error("Error fetching todos:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTodos();
    }, []);

    const addTodo = async (title) => {
        try {
            const res = await fetch("http://localhost:3000/todos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, completed: false }),
            });
            if (!res.ok) throw new Error("Failed to add todo");
            const newTodo = await res.json();
            setTodos((prev) => [...prev, newTodo]);
        } catch (err) {
            setError(err.message);
            console.error("Error adding todo:", err);
        }
    };

    const updateTodo = async (id, updatedTodo) => {
        try {
            const res = await fetch(`http://localhost:3000/todos/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedTodo),
            });
            if (!res.ok) throw new Error("Failed to update todo");
            const newTodo = await res.json();
            setTodos((prev) => prev.map((todo) => (todo.id === id ? newTodo : todo)));
        } catch (err) {
            setError(err.message);
            console.error("Error updating todo:", err);
        }
    };

    const deleteTodo = async (id) => {
        try {
            const res = await fetch(`http://localhost:3000/todos/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete todo");
            setTodos((prev) => prev.filter((todo) => todo.id !== id));
        } catch (err) {
            setError(err.message);
            console.error("Error deleting todo:", err);
        }
    };

    const toggleComplete = async (id) => {
        const todo = todos.find((t) => t.id === id);
        const updated = { ...todo, completed: !todo.completed };
        await updateTodo(id, updated);
    };

    return (
        <TodoContext.Provider
            value={{ todos, addTodo, updateTodo, deleteTodo, toggleComplete, loading, error }}
        >
            {children}
        </TodoContext.Provider>
    );
};

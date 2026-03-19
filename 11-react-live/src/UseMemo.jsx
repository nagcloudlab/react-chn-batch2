


// a function with 1M transactions

import { useState, useMemo } from "react"

function generateTransactions() {
    const transactions = []
    for (let i = 0; i < 10000; i++) {
        transactions.push({
            id: i,
            amount: Math.random() * 1000,
            type: Math.random() > 0.5 ? "income" : "expense"
        })
    }
    return transactions
}


function UseMemo() {
    console.log("component rendered")

    const [transactions, setTransactions] = useState(generateTransactions)
    // const totalIncome = transactions
    //     .filter(transaction => transaction.type === "income")
    //     .reduce((total, transaction) => {
    //         return total + transaction.amount
    //     }, 0)
    const totalIncome = useMemo(() => {
        console.log("Calculating total income...")
        return transactions
            .filter(transaction => transaction.type === "income")
            .reduce((total, transaction) => total + transaction.amount, 0)
    }, [transactions])

    const [count, setCount] = useState(0)

    return (
        <div>
            <h1>UseMemo</h1>
            <hr />
            <h2>Total Income: {totalIncome.toFixed(2)}</h2>
            <hr />
            Add New Transaction: <button onClick={() => setTransactions([...transactions, {
                id: transactions.length,
                amount: Math.random() * 1000,
                type: Math.random() > 0.5 ? "income" : "expense"
            }])}>Add Transaction</button>
            <hr />
            <button onClick={() => setCount(count + 1)}>Increment Count: {count}</button>
        </div>
    );
}

export default UseMemo;
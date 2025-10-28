"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import ExpenseForm from "@/components/expense-form"
import { Expense } from "@/lib/models"
import { toast } from "sonner"

export default function AddExpensePage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (expenseData: Partial<Expense>) => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/admin/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseData),
      })

      if (response.ok) {
        const result = await response.json()
        toast.success('Expense added successfully!')
        router.push('/admin/expenses')
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to add expense')
      }
    } catch (error) {
      console.error('Error adding expense:', error)
      toast.error('An error occurred while adding the expense')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/admin/expenses')
  }

  return (
    <ExpenseForm
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isLoading}
    />
  )
}
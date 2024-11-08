'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import AuthenticatedNavigation from '../components/AuthenticatedNavigation'

const USER_BUCKET = 'bank-statements'

interface Account {
  id: number
  lastFourDigits: string
  statements: File[]
  error?: string
  isUploading?: boolean
}

interface CompanyInfo {
  name: string
  industry: string
  description: string
}

export default function StartPage() {
  const router = useRouter()
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: '',
    industry: '',
    description: ''
  })
  const [accounts, setAccounts] = useState<Account[]>([{ 
    id: 1, 
    lastFourDigits: '', 
    statements: [] 
  }])
  const [showValidationPopup, setShowValidationPopup] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const supabase = createClientComponentClient()

  const industries = [
    'Retail',
    'Technology',
    'Manufacturing',
    'Healthcare',
    'Construction',
  ]

  const handleLastFourDigits = (accountId: number, value: string) => {
    console.log('Updating account last four digits:', { accountId, value })
    if (!/^\d*$/.test(value)) return
    
    setAccounts(accounts.map(account => {
      if (account.id === accountId) {
        return {
          ...account,
          lastFourDigits: value
        }
      }
      return account
    }))
  }

  const addAccount = () => {
    console.log('Attempting to add new account. Current count:', accounts.length)
    if (accounts.length >= 10) {
      alert('Maximum 10 accounts allowed')
      return
    }
    
    setAccounts([
      ...accounts,
      {
        id: accounts.length + 1,
        lastFourDigits: '',
        statements: []
      }
    ])
  }

  const validateCompanyInfo = () => {
    return companyInfo.name.length > 0 && 
           companyInfo.industry.length > 0 && 
           companyInfo.description.length > 0
  }

  const logUploadAttempt = (filePath: string, userId: string | undefined) => {
    console.log('Upload attempt details:', {
      bucketId: USER_BUCKET,
      folderPath: filePath,
      userId: userId,
      timestamp: new Date().toISOString()
    })
  }

  const handleFileUpload = async (accountId: number) => {
    const currentAccount = accounts.find(a => a.id === accountId)
    if (!currentAccount) return
  
    setAccounts(accounts.map(a => 
      a.id === accountId ? { ...a, isUploading: true } : a
    ))
  
    try {
      for (const file of currentAccount.statements) {
        const fileExt = file.name.split('.').pop() || 'pdf'
        const fileName = `${companyInfo.name}-account-${currentAccount.lastFourDigits}-${Date.now()}.${fileExt}`
        const filePath = `${companyInfo.name}/${fileName}`
      
        const { error: uploadError } = await supabase.storage
          .from(USER_BUCKET)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          })
      
        if (uploadError) throw uploadError
      }
  
      setAccounts(accounts.map(a => 
        a.id === accountId ? { 
          ...a, 
          isUploading: false,
          statements: [],
          error: undefined
        } : a
      ))
  
      alert('Files uploaded successfully!')
    } catch (error) {
      console.error('Upload error:', error)
      setAccounts(accounts.map(a => 
        a.id === accountId ? { 
          ...a, 
          isUploading: false,
          error: 'Upload failed. Please try again.'
        } : a
      ))
    }
  }

  const isFormValid = () => {
    if (!companyInfo.name || !companyInfo.industry || !companyInfo.description) {
      return false
    }

    const hasValidAccount = accounts.some(account => 
      account.statements.length > 0 && 
      account.lastFourDigits.length === 4
    )

    const allAccountsValid = accounts.every(account => 
      account.statements.length === 0 || 
      (account.statements.length > 0 && account.lastFourDigits.length === 4)
    )

    return hasValidAccount && allAccountsValid
  }

  const handleNext = async () => {
    if (!isFormValid()) return
    setIsUploading(true)
  
    try {
      const { data: { user } } = await supabase.auth.getUser()

      console.log('Current user:', user)

      if (!user) throw new Error('No authenticated user')
  
      for (const account of accounts) {
        if (account.statements.length > 0) {
          for (const file of account.statements) {
            const fileExt = file.name.split('.').pop() || 'pdf'
            const fileName = `${companyInfo.name}-account-${account.lastFourDigits}-${Date.now()}.${fileExt}`
            const filePath = `${user.id}/${companyInfo.name}/${fileName}`
            
            logUploadAttempt(filePath, user.id)
            
            const { error: uploadError } = await supabase.storage
              .from(USER_BUCKET)
              .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
              })
            
            if (uploadError) {
              console.error('Storage upload error details:', {
                error: uploadError,
                filePath,
                fileName,
                fileSize: file.size
              })
              throw new Error(`Upload error: ${uploadError.message}`)
            }
          }
        }
      }
  
      console.log('Attempting database insertion:', {
        companyName: companyInfo.name,
        accountsCount: accounts.filter(a => a.statements.length > 0).length,
        userId: user.id
      })
  
      const { error: dbError } = await supabase
        .from('companies')
        .insert({
          name: companyInfo.name,
          industry: companyInfo.industry,
          description: companyInfo.description,
          accounts: accounts.filter(a => a.statements.length > 0).map(a => ({
            lastFourDigits: a.lastFourDigits,
            statementCount: a.statements.length
          }))
        })
  
      if (dbError) {
        console.error('Database insertion error:', dbError)
        throw new Error(`Database error: ${dbError.message}`)
      }
  
      router.push('/categorization')
    } catch (error) {
      if (error instanceof Error) {
        alert(`Error: ${error.message}`)
      } else {
        alert('An unknown error occurred')
      }
      console.error('Error:', error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <AuthenticatedNavigation />
      
      <div className="max-w-4xl mx-auto p-8">
        <div className="space-y-6 mb-12">
          <div className="flex items-center gap-4">
            <label className="w-64 text-right">Company Name:</label>
            <input
              type="text"
              value={companyInfo.name}
              onChange={(e) => setCompanyInfo({
                ...companyInfo,
                name: e.target.value.slice(0, 100)
              })}
              maxLength={100}
              className="flex-1 p-2 border rounded"
              placeholder="Enter company name"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="w-64 text-right">Industry:</label>
            <select
              value={companyInfo.industry}
              onChange={(e) => setCompanyInfo({
                ...companyInfo,
                industry: e.target.value
              })}
              className="flex-1 p-2 border rounded"
            >
              <option value="">Select an industry</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4">
            <label className="w-64 text-right">
              List goods and services your company provides:
            </label>
            <textarea
              value={companyInfo.description}
              onChange={(e) => setCompanyInfo({
                ...companyInfo,
                description: e.target.value.slice(0, 300)
              })}
              maxLength={300}
              className="flex-1 p-2 border rounded"
              rows={3}
            />
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4">Bank Statements</h2>
        <p className="mb-6">Please upload the bank statements for your business</p>

        {accounts.map((account) => (
          <div key={account.id} className="mt-4 space-y-4">
            <div className="flex items-center gap-4">
              <label className="w-64 text-right">Account {account.id}:</label>
              <div className="flex-1">
                <input
                  type="file"
                  multiple
                  accept=".pdf"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || [])
                    setAccounts(accounts.map(a => 
                      a.id === account.id ? { ...a, statements: files } : a
                    ))
                  }}
                  className="flex-1"
                />
                {account.error && (
                  <p className="text-red-500 text-sm mt-1">{account.error}</p>
                )}
              </div>
              <input
                type="text"
                value={account.lastFourDigits}
                onChange={(e) => handleLastFourDigits(account.id, e.target.value)}
                placeholder="Last 4 digits"
                maxLength={4}
                minLength={4}
                className="w-32 p-2 border rounded"
              />
            </div>
          </div>
        ))}

        <button
          onClick={addAccount}
          className="mt-6 text-blue-600 hover:text-blue-800"
        >
          + Add statements for an additional account
        </button>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleNext}
            disabled={!isFormValid() || isUploading}
            className={`px-6 py-2 rounded-lg text-white font-medium
              ${isFormValid() && !isUploading
                ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer' 
                : 'bg-gray-400 cursor-not-allowed'
              }`}
          >
            {isUploading ? 'Uploading...' : 'Next'}
          </button>
        </div>

        {!isFormValid() && (
          <div className="mt-4 text-sm text-gray-600">
            <p>To continue, please ensure:</p>
            <ul className="list-disc list-inside mt-2">
              {!companyInfo.name && (
                <li>Company name is entered</li>
              )}
              {!companyInfo.industry && (
                <li>Industry is selected</li>
              )}
              {!companyInfo.description && (
                <li>Company description is provided</li>
              )}
              {!accounts.some(a => a.statements.length > 0) && (
                <li>At least one bank statement is uploaded</li>
              )}
              {accounts.some(a => a.statements.length > 0 && a.lastFourDigits.length !== 4) && (
                <li>Last 4 digits are entered for all accounts with statements</li>
              )}
            </ul>
          </div>
        )}

        {showValidationPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p>Please input your company name, industry, and description first</p>
              <button 
                onClick={() => setShowValidationPopup(false)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              >
                Ok
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
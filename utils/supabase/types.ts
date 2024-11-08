export interface Database {
    public: {
      Tables: {
        companies: {
          Row: {
            id: string
            user_id: string
            name: string
            industry: string
            description: string
            created_at: string
            accounts: {
              last_four_digits: string
              statement_count: number
            }[]
          }
          Insert: {
            user_id: string
            name: string
            industry: string
            description: string
            accounts?: {
              last_four_digits: string
              statement_count: number
            }[]
            created_at?: string
          }
        }
        bank_statements: {
          Row: {
            id: string
            company_id: string
            user_id: string
            file_path: string
            last_four_digits: string
            uploaded_at: string
            status: string
          }
          Insert: {
            company_id: string
            user_id: string
            file_path: string
            last_four_digits: string
            status?: string
            uploaded_at?: string
          }
        }
      }
    }
  }
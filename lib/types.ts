export interface ApplicationData {
  // Step 1 — Business
  businessName: string
  dba: string
  businessAddress: string
  businessCity: string
  businessState: string
  businessZip: string
  businessPhone: string
  ein: string
  dateStarted: string
  entityType: string
  businessEmail: string
  businessDescription: string
  monthlyRevenue: string
  requestedAmount: string
  useOfFunds: string

  // Step 2 — Owner
  ownerName: string
  ownerTitle: string
  ownershipPct: string
  homeAddress: string
  homeCity: string
  homeState: string
  homeZip: string
  ssnFull: string
  dob: string
  ficoRange: string

  // Step 3 — Second Owner (optional)
  hasSecondOwner: boolean
  secondOwnerName: string
  secondOwnerTitle: string
  secondOwnerPct: string
  secondOwnerAddress: string
  secondOwnerCity: string
  secondOwnerState: string
  secondOwnerZip: string
  secondOwnerSsnFull: string
  secondOwnerDob: string
  secondOwnerFico: string

  // Step 4 — Documents
  openPositions: string
  mcaBalance: string
  bankStatementUrls: string[]
  bankStatementNames: string[]
  signatureName: string
  signatureDate: string
  authCheck1: boolean
  authCheck2: boolean
}

export const EMPTY_APPLICATION: ApplicationData = {
  businessName: '', dba: '', businessAddress: '', businessCity: '',
  businessState: '', businessZip: '', businessPhone: '', ein: '',
  dateStarted: '', entityType: '', businessEmail: '', businessDescription: '',
  monthlyRevenue: '', requestedAmount: '', useOfFunds: '',
  ownerName: '', ownerTitle: '', ownershipPct: '', homeAddress: '',
  homeCity: '', homeState: '', homeZip: '', ssnFull: '', dob: '', ficoRange: '',
  hasSecondOwner: false,
  secondOwnerName: '', secondOwnerTitle: '', secondOwnerPct: '',
  secondOwnerAddress: '', secondOwnerCity: '', secondOwnerState: '',
  secondOwnerZip: '', secondOwnerSsnFull: '', secondOwnerDob: '', secondOwnerFico: '',
  openPositions: '', mcaBalance: '', bankStatementUrls: [], bankStatementNames: [],
  signatureName: '', signatureDate: '', authCheck1: false, authCheck2: false,
}

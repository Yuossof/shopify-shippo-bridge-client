import { MapPin, Building2, Mail, Phone, Globe } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Address } from "../types/addresses.types"

type AddressesTableProps = {
  addresses: Address[]
}

const AddressesTable = ({ addresses }: AddressesTableProps) => {
  return (
    <div className="w-full space-y-4 px-4 md:px-0">
      <div className="rounded-lg border border-border/70 bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-[900px] table-fixed w-full">
            <TableHeader>
              <TableRow className="border-b border-border/70 hover:bg-transparent">
                <TableHead className="w-[18%] h-10 text-[11px] font-medium uppercase tracking-wide text-muted-foreground/80 pl-4">Name</TableHead>
                <TableHead className="w-[8%] h-10 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Company</TableHead>
                <TableHead className="w-[22%] h-10 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Address</TableHead>
                <TableHead className="w-[8%] h-10 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">City</TableHead>
                <TableHead className="w-[6%] h-10 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">State</TableHead>
                <TableHead className="w-[8%] h-10 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Zip</TableHead>
                <TableHead className="w-[6%] h-10 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Country</TableHead>
                <TableHead className="w-[10%] h-10 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Contact</TableHead>
                <TableHead className="w-[14%] h-10 text-[11px] font-medium uppercase tracking-wide text-muted-foreground pr-4">Shop</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {addresses.map((address) => (
                <TableRow
                  key={address._id}
                  className="border-b border-border/60 hover:bg-muted/40 transition-colors"
                >
                  <TableCell className="py-3 pl-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-medium text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-[13px] font-medium text-foreground truncate">{address.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-xs text-muted-foreground">
                    {address.company ? (
                      <span className="flex items-center gap-1.5">
                        <Building2 className="h-3 w-3 shrink-0" />
                        {address.company}
                      </span>
                    ) : (
                      <span className="text-muted-foreground/50">—</span>
                    )}
                  </TableCell>
                  <TableCell className="py-3 text-xs text-muted-foreground">
                    <div className="truncate max-w-[200px]">
                      {address.street1}{address.street2 ? `, ${address.street2}` : ''}
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-xs text-foreground">{address.city}</TableCell>
                  <TableCell className="py-3 text-xs text-foreground">{address.state}</TableCell>
                  <TableCell className="py-3 text-xs text-foreground">{address.zip}</TableCell>
                  <TableCell className="py-3">
                    <span className="inline-flex items-center gap-1 text-xs font-medium">
                      <Globe className="h-3 w-3 text-muted-foreground" />
                      {address.country}
                    </span>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex flex-col gap-0.5">
                      {address.email && (
                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground truncate max-w-[120px]">
                          <Mail className="h-3 w-3 shrink-0" />
                          {address.email}
                        </span>
                      )}
                      {address.phone && (
                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Phone className="h-3 w-3 shrink-0" />
                          {address.phone}
                        </span>
                      )}
                      {!address.email && !address.phone && (
                        <span className="text-muted-foreground/50">—</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-[11px] text-muted-foreground truncate max-w-[150px] pr-4">
                    {address.shopUrl || <span className="text-muted-foreground/50">—</span>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export default AddressesTable

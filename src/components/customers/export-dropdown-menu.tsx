"use client"
import { PencilIcon, ShareIcon, TrashIcon } from "lucide-react"
import { RiFileExcel2Line } from "react-icons/ri";
import { BsFiletypeCsv } from "react-icons/bs";
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

//customs
import { PiExport } from "react-icons/pi";

export function ExportDropdownMenuDestructive() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger 
      render={
        <Button 
        variant="outline"
        className={`cursor-pointer bg-inherit text-black hover:bg-gray-300`}
        >
          <PiExport/>
          Export
        </Button>
      } />
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <RiFileExcel2Line />
            Excel
          </DropdownMenuItem>
          <DropdownMenuItem>
            <BsFiletypeCsv />
            CSV
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
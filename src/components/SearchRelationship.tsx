import { SearchableRelationship } from '@/types/Relationship'
import { Button } from '@zendeskgarden/react-buttons'
import {
  Combobox,
  Field,
  Label,
  Option,
} from '@zendeskgarden/react-dropdowns.next'
import { FormEvent, useEffect, useState } from 'react'
import { useFamilyTree } from '@/components/FamilyTreeProvider'
import Select from "react-select";

const SearchRelationship = () => {
  const [member, setMember] = useState<string>('')
  const [relative, setRelative] = useState<string>('')
  const { familyTree, memberNames = [] } = useFamilyTree()
  const [result, setResult] = useState<SearchableRelationship | null>()
  const [shouldShowSearchResult, setshouldShowSearchResult] = useState(false)

  const handleSearchMember = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      const response = familyTree.getRelationship(member, relative)
      setshouldShowSearchResult(true)

      setResult(response)
    } catch (error) {
      alert(error)
    }
  }
  const [options, SetOption] = useState<any[]>([])

  useEffect(() => {
    let val: any = [];

    {
      memberNames.map((memberName, index) => (
        val.push({ value: `id${index}`, label: memberName },)
      ))
    }

    SetOption(val)
  }, [memberNames])

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSearchMember}
      role="form"
    >
      <p className=" text-gray-500">Find relationship between two members</p>
      <Field>
        <Label>Select member</Label>
        <Select options={options} onChange={(selectionValue: { value: string; label: string } | null) => {
          if (selectionValue && selectionValue.label !== undefined) {
            setRelative(selectionValue.label);
            setshouldShowSearchResult(false);
          }
        }}></Select>
        {/* <Combobox
          isEditable={false}
          onChange={({ selectionValue }) => {
            if (selectionValue !== undefined) {
              setMember(selectionValue as string)
              setshouldShowSearchResult(false)
            }
          }}
          placeholder="Select a member"
          inputProps={{ required: true }}
        >
          {memberNames.map((memberName) => (
            <Option key={memberName} value={memberName} label={memberName} />
          ))}
        </Combobox> */}
      </Field>
      <Field>
        <Label>Select relative</Label>
        {/* <Combobox
          isEditable={false}
          onChange={({ selectionValue }) => {
            if (selectionValue !== undefined) {
              setRelative(selectionValue as string)
              setshouldShowSearchResult(false)
            }
          }}
          placeholder="Select a relative"
          inputProps={{ required: true }}
        >
          {memberNames.map((memberName) => (
            <Option key={memberName} value={memberName} label={memberName} />
          ))}
        </Combobox> */}

        <Select options={options} onChange={(selectionValue: { value: string; label: string } | null) => {
          if (selectionValue && selectionValue.label !== undefined) {
            setRelative(selectionValue.label);
            setshouldShowSearchResult(false);
          }
        }}>

        </Select>
      </Field>

      <Field className="mt-2">
        <Button type="submit">Search</Button>
      </Field>
      {shouldShowSearchResult && (
        <Field className="font-semibold">
          {`Relationship: 
        ${result ?? `Unable to determine the relationship`}`}
        </Field>
      )}
    </form>
  )
}

export default SearchRelationship

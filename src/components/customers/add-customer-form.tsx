'use client'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useMemo, useState } from "react"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

//combobox for long lists (fast and searchable)
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox"

// import countriesList,{type Country} from 'country-list'
import {Country, City, State} from 'country-state-city'
import { FaArrowLeft } from "react-icons/fa";
const genders = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
]
/*
 
*/
export function InputForm() {
    const countries = useMemo(
      () => {
          return Country.getAllCountries().map((country)=>{
              return {
                  label: country.name,
                  value: country.isoCode,
                  phonecode: country.phonecode,
                //   flag: country.flag,
              }
          });
      },[]);

    const [countryCode,setCountryCode]= useState<string | undefined>();
    const [stateCode, setStateCode] = useState<string |undefined>();
    const [cityName, setCityName] = useState<string |undefined>();
    
    const [gender, setGender] = useState<string | undefined>();

    const states = useMemo( 
        () => {
          if(!countryCode) return[];
        return State.getStatesOfCountry(countryCode).map((state)=>{
            return {
                label:state.name,
                value:state.isoCode
            };
        });
    },[countryCode]);
    
    const cities = useMemo(()=>{
      /*
        some countries has thousands of cities all these cities must be parsed by the browser and converted to 
        SelectItem element in the dom and this takes time and affect the user experience 
        the solution is not to get all the country city like in this code but only get the cities in the selected state 

        if(!countryCode) return [];
        
        const raw = stateCode ? City.getCitiesOfState(countryCode,stateCode): City.getCitiesOfCountry(countryCode) ?? []
        */
        if(!countryCode || !stateCode) return [];
        
        const raw = City.getCitiesOfState(countryCode,stateCode);

         // City names can repeat, so dedupe to keep values/keys unique
        return Array.from(new Set(raw.map((c) => c.name))).sort();

    },[countryCode, stateCode])

    const selectedCountry = countries.find((c) => c.value === countryCode);
    const selectedState = states.find((s) => s.value === stateCode);

    function handleCountryChange(value: string | null){
        setCountryCode(value ?? undefined);
        setStateCode(undefined);
        setCityName(undefined);

    }
    function handleStateChange(value: string | null) {
        setStateCode(value ?? undefined);
        setCityName(undefined); // when state changes delete city
    }

    //for birth day input field
    const today = new Date().toLocaleDateString("en-CA")
  return (
    <form className="w-full bg-yellow-50 p-4 md:p-8 border shadow rounded-2xl  max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
      <header className="mb-8">
          <h2 className="font-semibold text-xl md:text-2xl">Add Customer</h2>
      </header>
      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
            <Field>
                <FieldLabel htmlFor="form-first-name">First Name</FieldLabel>
                <Input
                    id="form-first-name"
                    name="first-name"
                    type="text"
                    placeholder="Mohamed"
                    required
                />
            </Field>
            <Field>
                <FieldLabel htmlFor="form-last-name">Last Name</FieldLabel>
                <Input
                    id="form-last-name"
                    name="last-name"
                    type="text"
                    placeholder="Ali"
                    required
                />
            </Field>

        </div>
        <Field>
          <FieldLabel htmlFor="form-email">Email</FieldLabel>
          <Input 
          id="form-email"
          name="email" 
          type="email" 
          placeholder="mohamed@example.com" />
          {/* <FieldDescription>
            We&apos;ll never share your email with anyone.
          </FieldDescription> */}
        </Field>
        <div className="grid grid-cols-2 gap-4">
            {/* Birth date */}
            <Field>
                <FieldLabel htmlFor="form-birth-date">Birth Date</FieldLabel>
                <Input
                id="form-birth-date"
                name="birthDate"
                type="date"
                max={today}
                required
                />
            </Field>

            {/* Gender */}
            <Field>
                <FieldLabel htmlFor="form-gender">Gender</FieldLabel>
                <Select
                name="gender"
                items={genders}
                value={gender ?? null}
                onValueChange={(v) => setGender(v ?? undefined)}
                >
                <SelectTrigger id="form-gender">
                    <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                    {genders.map((g) => (
                        <SelectItem key={g.value} value={g.value}>
                        {g.label}
                        </SelectItem>
                    ))}
                    </SelectGroup>
                </SelectContent>
                </Select>
            </Field>
            </div>
        <div className="grid grid-cols-2 gap-4">
          {/* country */}
          <Field>
            <FieldLabel htmlFor="form-country">Country</FieldLabel>
            <Combobox
              items={countries}
              value={selectedCountry ?? null}
              onValueChange={(item) => handleCountryChange(item?.value ?? null)}
              isItemEqualToValue={(a, b) => a.value === b.value}
              modal={false}
            >
              <ComboboxInput
                id="form-country"
                placeholder={'Select a country'}
              />
              <ComboboxContent>
                <ComboboxEmpty>No countries found.</ComboboxEmpty>
                <ComboboxList>
                  {(country) => (
                    <ComboboxItem key={country.value} value={country}>
                      {country.label}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
            {/* عشان القيمة تتبعت مع الـ form بكود الدولة (مثلاً EG) */}
            <input type="hidden" name="country" value={countryCode ?? ""} /> 
          </Field>
          {/* State */}
          <Field>
            <FieldLabel htmlFor="form-state">State</FieldLabel>
            <Combobox
              items={states}
              value={selectedState ?? null}
              onValueChange={(item) => handleStateChange(item?.value ?? null)}
              isItemEqualToValue={(a, b) => a.value === b.value}
              disabled={states.length === 0}
            >
              <ComboboxInput
                id="form-state"
                placeholder={
                  !countryCode
                    ? "Select country first"
                    : states.length
                    ? "Search state"
                    : "No states"
                }
                // disabled={states.length === 0}
              />
              <ComboboxContent>
                <ComboboxEmpty>No states found.</ComboboxEmpty>
                <ComboboxList>
                  {(state) => (
                    <ComboboxItem key={state.value} value={state}>
                      {state.label}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
            <input type="hidden" name="state" value={stateCode ?? ""} />
          </Field>

          {/* city */}
          <Field>
            <FieldLabel htmlFor="form-city">City</FieldLabel>
            <Combobox
              items={cities}
              value={cityName ?? null}
              onValueChange={(v) => setCityName(v ?? undefined)}
              disabled={cities.length === 0}
              limit={50}
            >
              <ComboboxInput
                id="form-city"
                placeholder={
                  !stateCode
                    ? "Select state first"
                    : cities.length
                    ? "Search city"
                    : "No cities"
                }
                // disabled={cities.length === 0}
              />
              <ComboboxContent>
                <ComboboxEmpty>No cities found.</ComboboxEmpty>
                <ComboboxList>
                  {(city) => (
                    <ComboboxItem key={city} value={city}>
                      {city}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
            <input type="hidden" name="city" value={cityName ?? ""} />
          </Field>
        </div>
        <Field>
            <FieldLabel htmlFor="form-phone">Phone</FieldLabel>
            <Input 
            id="form-phone" 
            name="phone"
            type="tel" 
            placeholder={`+${selectedCountry?.phonecode ??'1'} 555 123-4567`} />
          </Field>
        <Field>
          <FieldLabel htmlFor="form-address">Address</FieldLabel>
          <Input 
          id="form-address" 
          name="address"
          type="text" 
          placeholder="123 Main St" />
        </Field>
        <Field orientation="horizontal">
          <Link href={'/customers'}>
            <Button type="button" variant="outline" onClick={()=>{}}>
              Cancel
            </Button>
          </Link>
          <Button type="submit" className={'bg-blue-800'}>Submit</Button>
        </Field>
      </FieldGroup>
    </form>
  )
}

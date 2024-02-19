import { Controller } from "react-hook-form";

export default function Checkbox ({ name, checked, control,  label, error, ...args }) {

    return (
        <Controller
            name={name}
            defaultValue={checked}
            control={control}
            render={({ field: { value, onChange } }) => {
                return (
                    <div className="w-full p-2">
                        <div className="flex items-center">
                            <h3 className="font-bold text-lg mx-4">{label}</h3>
                            <input 
                                type="checkbox" 
                                {...args} 
                                onChange={onChange} checked={value} 
                                className="w-5 h-5"
                            />
                        </div>
                        <div>
                            {error && <span className="font-bold text-primaryBlue">preencha corretamente o campo</span>}
                        </div>
                    </div>
                )
            }}
        />
    )
}
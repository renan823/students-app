import { Controller } from "react-hook-form"

export default function Select ({ name, control, options, ...args }) {
    return (
        <Controller
            rules={{ required: true }}
            name={name}
            control={control}
            render={({ field }) => {
                return (
                    <select {...field} {...args}>
                        <option value="">-</option>
                        {
                            options.map((option, index: number) => {
                                return (
                                    <option className="font-bold" key={index} value={option.value}>{option.text}</option>
                                )
                            })
                        }
                    </select>
                )
            }}
        />
    )
}
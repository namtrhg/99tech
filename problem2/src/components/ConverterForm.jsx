import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
	fromValue: z.number().min(0, { message: "Value must be non-negative" }),
	toValue: z.number().min(0, { message: "Value must be non-negative" }),
	fromPrice: z.number().positive({ message: "Price must be a positive number" }),
	toPrice: z.number().positive({ message: "Price must be a positive number" }),
});

export default function CurrencySwapForm({ currencies }) {
	const [fromPrice, setFromPrice] = useState(currencies[0].price);
	const [toPrice, setToPrice] = useState(currencies[0].price);

	const { control, watch, setValue } = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			fromValue: null,
			toValue: null,
			fromPrice: currencies[0].price,
			toPrice: currencies[0].price,
		},
	});

	const values = watch();

	const calculateUsdEquivalent = (value, price) => {
		return (value * price).toFixed(5);
	};

	// Handle conversions
	const handleValueChange = (value, isFrom = true) => {
		const numericValue = value === "" ? 0 : parseFloat(value);
		if (isNaN(numericValue)) return;

		if (isFrom) {
			setValue("fromValue", value);
			setValue("toValue", value === "" ? "" : ((numericValue * fromPrice) / toPrice).toFixed(5).toString());
		} else {
			setValue("toValue", value);
			setValue("fromValue", value === "" ? "" : ((numericValue * toPrice) / fromPrice).toFixed(5).toString());
		}
	};

	const handlePriceChange = (price, isFrom = true) => {
		const numericPrice = parseFloat(price);
		if (isFrom) {
			setFromPrice(numericPrice);
			setValue("toValue", ((parseFloat(values.fromValue) * numericPrice) / toPrice).toFixed(5).toString());
		} else {
			setToPrice(numericPrice);
			setValue("toValue", ((parseFloat(values.fromValue) * fromPrice) / numericPrice).toFixed(5).toString());
		}
	};

	const handleSwap = () => {
		alert("This is just a test!");
	};

	return (
		<div className="w-full lg:w-[29.5rem] bg-[#252B36] px-2 py-4 rounded-md">
			<h2 className="text-[#717A8C] px-2 mb-3">Crypto Swap</h2>
			<div className="space-y-2">
				<div className="bg-[#2B3342] p-4 rounded-md">
					<div className="flex justify-between items-center lg:space-x-4">
						<Controller
							control={control}
							name="fromValue"
							render={({ field, fieldState: { error } }) => (
								<>
									<input
										aria-label="first-token"
										className={`bg-[#2B3342] text-[#717A8C] text-xl font-semibold ${error ? "border-red-500" : ""}`}
										{...field}
										onChange={(e) => {
											field.onChange(e); // Inform react-hook-form of change
											handleValueChange(e.target.value, true);
										}}
										placeholder="0"
										type="number"
									/>
									{error && <p className="text-red-500 text-xs">{error.message}</p>}
								</>
							)}
						/>
						<select
							className="bg-[#252B36] px-2.5 p-1.5 text-white text-xs font-bold w-20 lg:w-28 rounded-md"
							value={fromPrice}
							onChange={(e) => handlePriceChange(e.target.value, true)}
						>
							{currencies.map((currency, index) => (
								<option key={`${currency.currency}-${index}`} value={currency.price}>
									{currency.currency}
								</option>
							))}
						</select>
					</div>
					<p className="mt-2 text-sm text-[#717A8C]">USD: ≈$ {calculateUsdEquivalent(values.fromValue, fromPrice)}</p>
				</div>
				<div className="bg-[#2B3342] p-4 rounded-md">
					<div className="flex justify-between items-center lg:space-x-4">
						<Controller
							control={control}
							name="toValue"
							render={({ field, fieldState: { error } }) => (
								<>
									<input
										aria-label="second-token"
										className={`bg-[#2B3342] text-[#717A8C] text-xl font-semibold ${error ? "border-red-500" : ""}`}
										{...field}
										onChange={(e) => {
											field.onChange(e); // Inform react-hook-form of change
											handleValueChange(e.target.value, false);
										}}
										placeholder="0"
										type="number"
									/>
									{error && <p className="text-red-500 text-xs">{error.message}</p>}
								</>
							)}
						/>
						<select
							className="bg-[#252B36] px-2.5 p-1.5 text-white text-xs font-bold w-20 lg:w-28 rounded-md"
							value={toPrice}
							onChange={(e) => handlePriceChange(e.target.value, false)}
						>
							{currencies.map((currency, index) => (
								<option key={`${currency.currency}-${index}`} value={currency.price}>
									{currency.currency}
								</option>
							))}
						</select>
					</div>
					<p className="mt-2 text-sm text-[#717A8C]">USD: ≈$ {calculateUsdEquivalent(values.toValue, toPrice)}</p>
				</div>
			</div>
			<button className="bg-[#C4B454] py-18 text-center text-white w-full rounded-md min-h-14 mt-3" onClick={handleSwap}>
				Swap
			</button>
		</div>
	);
}

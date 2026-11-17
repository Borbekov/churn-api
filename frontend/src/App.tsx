import {
	Button,
	Form,
	InputNumber,
	Modal,
	Select,
	Tooltip,
	type FormProps,
} from 'antd'
import { useState } from 'react'

const CONTRACT_OPTIONS = [
	{
		value: 'Month-to-month',
		label: 'Month-to-month',
	},
	{ value: 'One year', label: 'One year' },
	{ value: 'Two year', label: 'Two year' },
]
const INTERNET_SERVICES_OPTIONS = [
	{ value: 'DSL', label: 'DSL' },
	{ value: 'Fiber optic', label: 'Fiber optic' },
	{ value: 'No', label: 'No' },
]
const PAYMENT_METHODS_OPTIONS = [
	{
		value: 'Electronic check',
		label: 'Electronic check',
	},
	{
		value: 'Mailed check',
		label: 'Mailed check',
	},
	{
		value: 'Bank transfer (automatic)',
		label: 'Bank transfer (automatic)',
	},
	{
		value: 'Credit card (automatic)',
		label: 'Credit card (automatic)',
	},
]

type FieldType = {
	tenure: number
	monthly_charges: number
	contract: string
	internet_service: string
	payment_method: string
}

type ValidationError = {
	loc: (string | number)[]
	msg: string
	type: string
}

const Label = ({
	label,
	description,
}: {
	label: string
	description: string
}) => {
	return (
		<div className="flex gap-2 items-center">
			<p>{label}</p>
			<Tooltip title={description}>
				<span className="flex items-center justify-center cursor-pointer bg-[#FFFFFF] text-[#FF6B5B] border text-[12px] rounded-[100%] w-4 h-4">
					?
				</span>
			</Tooltip>
		</div>
	)
}

const App = () => {
	const [loading, setLoading] = useState(false)
	const [form] = Form.useForm()

	const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
		setLoading(true)
		try {
			const response = await fetch('/predict', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(values),
			})
			const data = await response.json()
			if (!response.ok) {
				if (response.status === 422 && Array.isArray(data.detail)) {
					const byField = new Map<string, string[]>()
					for (const e of data.detail as ValidationError[]) {
						const field = String(e.loc[e.loc.length - 1])
						byField.set(field, [
							...(byField.get(field) ?? []),
							e.msg,
						])
					}
					form.setFields(
						[...byField].map(([name, errors]) => ({
							name,
							errors,
						})),
					)
					return
				}
				throw new Error(
					typeof data.detail === 'string'
						? data.detail
						: `Request failed: ${response.status}`,
				)
			}
			const proba: number = data.churn_probability
			Modal.success({
				title: 'Churn probability',
				content: `${proba} or ${(proba * 100).toFixed(2)}%`,
				afterClose: () => form.resetFields(),
			})
		} catch (err) {
			Modal.error({
				title: 'Prediction failed',
				content: err instanceof Error ? err.message : String(err),
			})
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="flex justify-center items-center">
			<div className="flex flex-col gap-4 p-4 md:w-100 bg-[#F4EDE0] md:mt-25 md:rounded-lg w-full">
				<div>
					<h1 className="text-[#FF6B5B] text-3xl font-bold">
						Churn Predictor
					</h1>
					<p className="text-[#FF6B5B] text-md">
						Estimate how likely a customer is to leave
					</p>
				</div>
				<Form
					form={form}
					name="form"
					layout="vertical"
					onFinish={onFinish}
				>
					<Form.Item<FieldType>
						label={
							<Label
								label="Tenure (months)"
								description="Number of months the customer has stayed with the company"
							/>
						}
						name="tenure"
						rules={[
							{
								required: true,
								message: 'Please input the tenure',
							},
						]}
						style={{ marginBottom: 8 }}
					>
						<InputNumber
							size="large"
							placeholder="e.g. 4"
							style={{ width: '100%' }}
						/>
					</Form.Item>

					<Form.Item<FieldType>
						label={
							<Label
								label="Monthly charges"
								description="The amount charged to the customer monthly"
							/>
						}
						name="monthly_charges"
						rules={[
							{
								required: true,
								message: 'Please input the monthly charges',
							},
						]}
						style={{ marginBottom: 8 }}
					>
						<InputNumber
							size="large"
							placeholder="e.g. 44.4"
							style={{ width: '100%' }}
						/>
					</Form.Item>

					<Form.Item<FieldType>
						label={
							<Label
								label="Contract"
								description="The contract term of the customer"
							/>
						}
						name="contract"
						rules={[
							{
								required: true,
								message: 'Please select contract type',
							},
						]}
						style={{ marginBottom: 8 }}
					>
						<Select
							size="large"
							style={{ width: '100%' }}
							placeholder="Select contract type"
							options={CONTRACT_OPTIONS}
						/>
					</Form.Item>

					<Form.Item<FieldType>
						label={
							<Label
								label="Internet service"
								description="Customer's internet service provider"
							/>
						}
						name="internet_service"
						rules={[
							{
								required: true,
								message: 'Please select internet service',
							},
						]}
						style={{ marginBottom: 8 }}
					>
						<Select
							size="large"
							style={{ width: '100%' }}
							placeholder="Select internet service"
							options={INTERNET_SERVICES_OPTIONS}
						/>
					</Form.Item>

					<Form.Item<FieldType>
						label={
							<Label
								label="Payment method"
								description="The customer's payment method (Electronic check, Mailed check, Bank transfer"
							/>
						}
						name="payment_method"
						rules={[
							{
								required: true,
								message: 'Please select payment method',
							},
						]}
						style={{ marginBottom: 8 }}
					>
						<Select
							size="large"
							style={{ width: '100%' }}
							placeholder="Select payment method"
							options={PAYMENT_METHODS_OPTIONS}
						/>
					</Form.Item>

					<Form.Item>
						<Button
							size="large"
							type="primary"
							htmlType="submit"
							loading={loading}
							style={{
								width: '100%',
								marginTop: '12px',
								backgroundColor: '#FF6B5B',
							}}
						>
							Submit
						</Button>
					</Form.Item>
				</Form>
			</div>
		</div>
	)
}

export default App

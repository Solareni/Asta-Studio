// 根据id获取chathistory
// 示例消息数据
const messages = [
	{
		role: "user",
		content: "Explain quantum computing in simple terms",
	},
	{
		role: "assistant",
		content: `Quantum computing is a new type of computing that relies on the principles of quantum physics. Traditional computers, like the one you might be using right now, use bits to store and process information. These bits can represent either a 0 or a 1. In contrast, quantum computers use quantum bits, or qubits.

Unlike bits, qubits can represent not only a 0 or a 1 but also a superposition of both states simultaneously. This means that a qubit can be in multiple states at once, which allows quantum computers to perform certain calculations much faster and more efficiently.`,
	},
	{
		role: "user",
		content: "What are three great applications of quantum computing?",
	},
	{
		role: "assistant",
		content:
			"Three great applications of quantum computing are: Optimization of complex problems, Drug Discovery and Cryptography.",
	},
	{
		role: "user",
		content: "Explain quantum computing in simple terms",
	},
	{
		role: "assistant",
		content: `Quantum computing is a new type of computing that relies on the principles of quantum physics. Traditional computers, like the one you might be using right now, use bits to store and process information. These bits can represent either a 0 or a 1. In contrast, quantum computers use quantum bits, or qubits.

Unlike bits, qubits can represent not only a 0 or a 1 but also a superposition of both states simultaneously. This means that a qubit can be in multiple states at once, which allows quantum computers to perform certain calculations much faster and more efficiently.`,
	},
	{
		role: "user",
		content: "What are three great applications of quantum computing?",
	},
	{
		role: "assistant",
		content:
			"Three great applications of quantum computing are: Optimization of complex problems, Drug Discovery and Cryptography.",
	},
	{
		role: "user",
		content: "Explain quantum computing in simple terms",
	},
	{
		role: "assistant",
		content: `Quantum computing is a new type of computing that relies on the principles of quantum physics. Traditional computers, like the one you might be using right now, use bits to store and process information. These bits can represent either a 0 or a 1. In contrast, quantum computers use quantum bits, or qubits.

Unlike bits, qubits can represent not only a 0 or a 1 but also a superposition of both states simultaneously. This means that a qubit can be in multiple states at once, which allows quantum computers to perform certain calculations much faster and more efficiently.`,
	},
	{
		role: "user",
		content: "What are three great applications of quantum computing?",
	},
	{
		role: "assistant",
		content:
			"Three great applications of quantum computing are: Optimization of complex problems, Drug Discovery and Cryptography.",
	},
	{
		role: "user",
		content: "Explain quantum computing in simple terms",
	},
	{
		role: "assistant",
		content: `Quantum computing is a new type of computing that relies on the principles of quantum physics. Traditional computers, like the one you might be using right now, use bits to store and process information. These bits can represent either a 0 or a 1. In contrast, quantum computers use quantum bits, or qubits.

Unlike bits, qubits can represent not only a 0 or a 1 but also a superposition of both states simultaneously. This means that a qubit can be in multiple states at once, which allows quantum computers to perform certain calculations much faster and more efficiently.`,
	},
	{
		role: "user",
		content: "What are three great applications of quantum computing? hahha",
	},
	{
		role: "assistant",
		content:
			"Three great applications of quantum computing are: Optimization of complex problems, Drug Discovery and Cryptography.",
	},
];

export { messages };
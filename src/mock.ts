// 根据id获取chathistory
// 示例消息数据
const messages = [
	{
		role: "user",
		content: "Show me examples of markdown, code, and math formulas",
	},
	{
		role: "assistant",
		content: `Here are examples of different formatting:

### Markdown Examples
- Bullet points
- **Bold text**
- *Italic text*
- [Link example](https://example.com)


### Math Formulas
Here are some mathematical equations:
- Einstein's famous equation: $E = mc^2$
- Pythagorean theorem: $a^2 + b^2 = c^2$
- Quadratic formula: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$`
	},
	{
		role: "user",
		content: "Can you explain the quadratic formula aaaa?",
	},
	{
		role: "assistant",
		content: `The quadratic formula $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$ is used to solve quadratic equations in the form $ax^2 + bx + c = 0$

Let's break it down:
1. $a$ is the coefficient of $x^2$
2. $b$ is the coefficient of $x$
3. $c$ is the constant term

### Code Example

The $\\pm$ symbol means you'll get two solutions:
- One using the plus sign: $x = \\frac{-b + \\sqrt{b^2 - 4ac}}{2a}$
- One using the minus sign: $x = \\frac{-b - \\sqrt{b^2 - 4ac}}{2a}$`
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
    }

];

export { messages };
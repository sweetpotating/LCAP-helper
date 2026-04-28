import anthropic

client = anthropic.Anthropic()  # Set ANTHROPIC_API_KEY env variable

# Read your markdown file
with open("knowledge_base.md", "r") as f:
    kb_content = f.read()

# Ask a question using your knowledge base
response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=16000,
    system=f"Use this knowledge base to answer questions:\n\n{kb_content}",
    messages=[{"role": "user", "content": "What is this document about?"}]
)

print(response.content[0].text)

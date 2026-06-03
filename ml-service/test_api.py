import requests
import re

# Test regex first
def parse_log_line(line):
    pattern = r'(\d+\.\d+\.\d+\.\d+).+?"[^"]*"\s+(\d{3})'
    match = re.search(pattern, line)
    if match:
        return {'ip': match.group(1), 'status_code': int(match.group(2))}
    return None

# Test parsing
with open("test.log", "r") as f:
    lines = f.readlines()
    for line in lines:
        result = parse_log_line(line)
        print(f"Line: {line.strip()}")
        print(f"Parsed: {result}")
        print("---")
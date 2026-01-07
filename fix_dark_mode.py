
import re
import os

file_path = '/home/david/my_local_2/simaud-lex-frontend_2/src/components/forms/SimulationFormComplete.tsx'

with open(file_path, 'r') as f:
    content = f.read()

# 1. Fix text-gray-700
# Replace 'text-gray-700' with 'text-gray-700 dark:text-gray-300' if not already followed by dark:text-gray-300
def replace_text_gray(match):
    full_match = match.group(0)
    if 'dark:text-gray-300' in full_match:
        return full_match
    # Check if the dark class is immediately after in the string (unlikely but possible)
    # Simplified: just replace specific string occurrence
    return full_match.replace('text-gray-700', 'text-gray-700 dark:text-gray-300')

# We use regex to find class attributes containing text-gray-700 but not dark:text-gray-300
# Actually, simplest way is to replace all text-gray-700, then fix duplicates
content = content.replace('text-gray-700', 'text-gray-700 dark:text-gray-300')
content = content.replace('dark:text-gray-300 dark:text-gray-300', 'dark:text-gray-300')

# 2. Fix bg-white
# Target only bg-white inside className
content = content.replace('bg-white', 'bg-white dark:bg-slate-900')
content = content.replace('dark:bg-slate-900 dark:bg-slate-900', 'dark:bg-slate-900')

# 3. Fix Inputs/Selects (class="... border-input bg-background ...")
# This is common in shadcn ui components
target_input_class = 'border-input bg-background'
replacement_input_class = 'border-input bg-background dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100'

content = content.replace(target_input_class, replacement_input_class)
# Fix duplicates if any
content = content.replace('dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 dark:bg-slate-800', 'dark:bg-slate-800')
content = content.replace('dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 dark:bg-slate-900', 'dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100') 

# 4. Fix specific hardcoded "bg-primary-50" (if not handled)
# content = content.replace('bg-primary-50', 'bg-primary-50 dark:bg-primary-900/20')
# content = content.replace('dark:bg-primary-900/20 dark:bg-primary-900/20', 'dark:bg-primary-900/20')

with open(file_path, 'w') as f:
    f.write(content)

print("Successfully updated dark mode classes.")

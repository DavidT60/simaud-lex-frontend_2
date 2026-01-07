
import re

file_path = '/home/david/my_local_2/simaud-lex-frontend_2/src/components/forms/SimulationFormComplete.tsx'

with open(file_path, 'r') as f:
    content = f.read()

# 1. Inputs that have no class at all or only placeholder
# We look for <Input ... /> that DOES NOT have className
# AND <Input ... className="..." /> that DOES NOT have dark:bg-slate-800
# Regex to find <Input tags
def add_dark_mode_to_input(match):
    tag = match.group(0)
    if 'className="' in tag:
        if 'dark:bg-slate-800' not in tag:
            # Append to existing className
            return tag.replace('className="', 'className="dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 ')
        else:
            return tag
    else:
        # Add className
        return tag.replace('<Input', '<Input className="dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100"')

# Robust regex for <Input ... /> but careful not to break things.
# Simpler approach: find all <Input and check manually?
# Actually, let's just find lines with <Input and replace.
lines = content.split('\n')
new_lines = []
for line in lines:
    if '<Input' in line:
        if 'className="' in line:
            if 'dark:bg-slate-800' not in line:
                line = line.replace('className="', 'className="dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 ')
        else:
             line = line.replace('<Input', '<Input className="dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100"')
    
    # Also Check Selects that might have been missed if they don't have border-input class
    if '<select' in line:
         if 'className="' in line:
            if 'dark:bg-slate-800' not in line:
                 line = line.replace('className="', 'className="dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 ')
    
    # Fix the duplicated class in line 421 seen above
    line = line.replace('dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 px-3 py-2 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100', 'px-3 py-2 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100')
    
    new_lines.append(line)

content = '\n'.join(new_lines)

with open(file_path, 'w') as f:
    f.write(content)

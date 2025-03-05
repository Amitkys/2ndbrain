#!/bin/bash

# Add all changes
git add .

# Commit with the message provided as the first argument
git commit -m "$1"

# Prompt for the branch if not provided
if [ -z "$2" ]; then
  read -p "Enter the branch name: " branch
else
  branch=$2
fi

# Check if the specified remote branch exists
if git ls-remote --exit-code --heads origin "$branch"; then
  echo "pushing... Branch: '$branch'"
  git push origin "$branch"
else
  echo "Branch '$branch' does not exist on the remote. Aborting push."
  exit 1
fi


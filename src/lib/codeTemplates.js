// Code templates for different programming languages and question types

export const getCodeTemplate = (language, type) => {
  const templates = {
    cpp: {
      array: `#include <vector>
#include <iostream>

using namespace std;

// TODO: Implement your solution here
vector<int> solve(vector<int>& nums) {
    // Write your code here
    return {};
}`,
      string: `#include <string>
#include <iostream>

using namespace std;

// TODO: Implement your solution here
string solve(string s) {
    // Write your code here
    return "";
}`,
      tree: `#include <iostream>

// Definition for a binary tree node
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

// TODO: Implement your solution here
int solve(TreeNode* root) {
    // Write your code here
    return 0;
}`
    },
    c: {
      array: `#include <stdio.h>
#include <stdlib.h>

// TODO: Implement your solution here
int* solve(int* nums, int numsSize, int* returnSize) {
    // Write your code here
    *returnSize = 0;
    return NULL;
}`,
      string: `#include <stdio.h>
#include <string.h>
#include <stdlib.h>

// TODO: Implement your solution here
char* solve(const char* s) {
    // Write your code here
    return NULL;
}`,
      tree: `#include <stdio.h>
#include <stdlib.h>

// Definition for a binary tree node
struct TreeNode {
    int val;
    struct TreeNode *left;
    struct TreeNode *right;
};

// TODO: Implement your solution here
int solve(struct TreeNode* root) {
    // Write your code here
    return 0;
}`
    },
    java: {
      array: `import java.util.*;

public class Solution {
    // TODO: Implement your solution here
    public int[] solve(int[] nums) {
        // Write your code here
        return new int[0];
    }
}`,
      string: `public class Solution {
    // TODO: Implement your solution here
    public String solve(String s) {
        // Write your code here
        return "";
    }
}`,
      tree: `// Definition for a binary tree node
class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

public class Solution {
    // TODO: Implement your solution here
    public int solve(TreeNode root) {
        // Write your code here
        return 0;
    }
}`
    }
  };

  // Determine question type based on keywords in the question
  const getQuestionType = (question) => {
    const lowerQuestion = question.toLowerCase();
    if (lowerQuestion.includes('array') || lowerQuestion.includes('list')) return 'array';
    if (lowerQuestion.includes('string') || lowerQuestion.includes('text')) return 'string';
    if (lowerQuestion.includes('tree') || lowerQuestion.includes('node')) return 'tree';
    return 'array'; // Default to array type
  };

  // Get the appropriate template
  const questionType = getQuestionType(type);
  return templates[language]?.[questionType] || templates[language]?.array || '';
}; 
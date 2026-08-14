import { AppData, Topic } from "./types";

const generateId = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

const parseTopics = (topics: any[]): Topic[] => 
  topics.map(t => ({
    id: generateId(t.name),
    name: t.name,
    status: t.status as any,
    confidence: t.confidence || 0,
    difficulty: 'medium'
  }));

export const defaultData: AppData = {
  targetGoal: 190,
  targetDate: "2026-08-15",
  freezesAllowed: 2,
  freezesUsedThisMonth: 1,
  
  academics: {
    maxMarks: 30,
    exams: [
      { label: "1st Mid-Term", range: "Mar 9–14", status: "done", marks: [
        { subject: "Data Structures", obtained: 28 },
        { subject: "Algorithms", obtained: 25 },
        { subject: "DBMS", obtained: 29 },
        { subject: "OS", obtained: 27 },
      ]},
      { label: "2nd Mid-Term", range: "Apr 27–May 2", status: "upcoming", marks: [] },
      { label: "Internal Practical Viva", range: "Apr 20–24", status: "upcoming", marks: [] },
      { label: "End-Term Practical", range: "May 7–21", status: "upcoming", marks: [] },
      { label: "End-Term Theory", range: "May 22+", status: "upcoming", marks: [] },
    ]
  },

  progress: {
    basics: {
      label: "Step 1 · Learn the Basics",
      total: 54,
      topics: parseTopics([
        { name: "User Input/Output", status: "done", confidence: 9 },
        { name: "Data Types", status: "done", confidence: 9 },
        { name: "If-Else Statements", status: "done", confidence: 9 },
        { name: "Switch Statements", status: "done", confidence: 9 },
        { name: "Arrays & Strings", status: "done", confidence: 9 },
        { name: "For Loops", status: "done", confidence: 9 },
        { name: "While Loops", status: "done", confidence: 9 },
        { name: "Functions (Pass by Value/Ref)", status: "done", confidence: 9 },
        { name: "Time & Space Complexity", status: "done", confidence: 8 },
        { name: "Pattern Printing", status: "done", confidence: 9 },
        { name: "STL (C++)", status: "done", confidence: 8 },
        { name: "Basic Maths — Count Digits", status: "done", confidence: 9 },
        { name: "Basic Maths — Reverse Number", status: "done", confidence: 9 },
        { name: "Basic Maths — Check Palindrome", status: "done", confidence: 9 },
        { name: "Basic Maths — GCD/HCF", status: "done", confidence: 8 },
        { name: "Basic Maths — Armstrong Number", status: "done", confidence: 9 },
        { name: "Basic Maths — Print All Divisors", status: "done", confidence: 9 },
        { name: "Basic Maths — Check Prime", status: "done", confidence: 9 },
        { name: "Basic Recursion — Print 1 to N", status: "done", confidence: 9 },
        { name: "Basic Recursion — Print N to 1", status: "done", confidence: 9 },
        { name: "Basic Recursion — Sum of 1 to N", status: "done", confidence: 9 },
        { name: "Basic Recursion — Factorial", status: "done", confidence: 9 },
        { name: "Basic Recursion — Reverse Array", status: "done", confidence: 9 },
        { name: "Basic Recursion — Fibonacci", status: "done", confidence: 8 },
        { name: "Hashing — Counting Frequencies", status: "done", confidence: 8 },
        { name: "Hashing — Find Highest/Lowest Freq", status: "done", confidence: 8 },
        { name: "Pattern 1-28 (All Patterns)", status: "done", confidence: 9 },
        { name: "Advanced Recursion Problems", status: "done", confidence: 8 },
      ])
    },
    sorting: {
      label: "Step 2 · Sorting Techniques",
      total: 7,
      topics: parseTopics([
        { name: "Selection Sort", status: "done", confidence: 9 },
        { name: "Bubble Sort", status: "done", confidence: 9 },
        { name: "Insertion Sort", status: "done", confidence: 9 },
        { name: "Merge Sort", status: "done", confidence: 8 },
        { name: "Quick Sort", status: "done", confidence: 8 },
        { name: "Recursive Bubble Sort", status: "done", confidence: 8 },
        { name: "Recursive Insertion Sort", status: "pending", confidence: 0 },
      ])
    },
    arraysEasy: {
      label: "Step 3 · Arrays — Easy",
      total: 14,
      topics: parseTopics([
        { name: "Largest Element in Array", status: "done", confidence: 9 },
        { name: "Second Largest Element", status: "done", confidence: 9 },
        { name: "Check if Array is Sorted", status: "done", confidence: 9 },
        { name: "Remove Duplicates from Sorted Array", status: "done", confidence: 8 },
        { name: "Left Rotate by One Place", status: "done", confidence: 9 },
        { name: "Left Rotate by K Places", status: "done", confidence: 9 },
        { name: "Move Zeroes to End", status: "done", confidence: 9 },
        { name: "Linear Search", status: "done", confidence: 9 },
        { name: "Union of Two Sorted Arrays", status: "done", confidence: 9 },
        { name: "Find Missing Number", status: "done", confidence: 9 },
        { name: "Max Consecutive Ones", status: "done", confidence: 9 },
        { name: "Find Number that Appears Once", status: "done", confidence: 9 },
        { name: "Longest Subarray with Sum K (Positives)", status: "done", confidence: 9 },
        { name: "Longest Subarray with Sum K (Zeros & Negatives)", status: "done", confidence: 9 },
      ])
    },
    arraysMedium: {
      label: "Step 3 · Arrays — Medium",
      total: 14,
      topics: parseTopics([
        { name: "Two Sum", status: "done", confidence: 9 },
        { name: "Sort Array of 0s 1s 2s (Dutch Flag)", status: "done", confidence: 9 },
        { name: "Majority Element (>N/2 times)", status: "done", confidence: 9 },
        { name: "Kadane's Algorithm — Max Subarray Sum", status: "done", confidence: 8 },
        { name: "Stock Buy & Sell", status: "done", confidence: 8 },
        { name: "Rearrange Array by Sign", status: "done", confidence: 9 },
        { name: "Next Permutation", status: "done", confidence: 8 },
        { name: "Leaders in an Array", status: "done", confidence: 8 },
        { name: "Longest Consecutive Sequence", status: "done", confidence: 8 },
        { name: "Set Matrix Zeroes", status: "done", confidence: 8 },
        { name: "Rotate Matrix by 90°", status: "done", confidence: 8 },
        { name: "Print Spiral Matrix", status: "done", confidence: 8 },
        { name: "Count Subarrays with Given Sum", status: "done", confidence: 8 },
        { name: "Subarray with Given XOR", status: "done", confidence: 8 },
      ])
    },
    arraysHard: {
      label: "Step 3 · Arrays — Hard",
      total: 12,
      topics: parseTopics([
        { name: "Pascal's Triangle", status: "done", confidence: 9 },
        { name: "Majority Element (>N/3 times)", status: "done", confidence: 9 },
        { name: "3 Sum", status: "done", confidence: 9 },
        { name: "4 Sum", status: "done", confidence: 9 },
        { name: "Third Largest Number", status: "done", confidence: 9 },
        { name: "Even Odd Arrangement in LL", status: "done", confidence: 9 },
        { name: "Largest Subarray with 0 Sum", status: "pending", confidence: 0 },
        { name: "Count Inversions in Array", status: "pending", confidence: 0 },
        { name: "Reverse Pairs", status: "pending", confidence: 0 },
        { name: "Maximum Product Subarray", status: "pending", confidence: 0 },
        { name: "Merge Overlapping Intervals", status: "done", confidence: 9 },
        { name: "Merge Two Sorted Arrays Without Space", status: "pending", confidence: 0 },
        { name: "Find Duplicate in Array", status: "pending", confidence: 0 },
        { name: "Count Subarrays with given XOR K", status: "pending", confidence: 0 },
      ])
    },
    binarySearch: {
      label: "Step 4 · Binary Search",
      total: 32,
      topics: parseTopics([
        { name: "Binary Search to Find X", status: "done", confidence: 9 },
        { name: "Lower Bound", status: "done", confidence: 9 },
        { name: "Upper Bound", status: "done", confidence: 9 },
        { name: "Search Insert Position", status: "done", confidence: 9 },
        { name: "Floor & Ceil in Sorted Array", status: "done", confidence: 9 },
        { name: "First & Last Occurrence", status: "done", confidence: 8 },
        { name: "Count Occurrences in Sorted Array", status: "done", confidence: 8 },
        { name: "Search in Rotated Sorted Array I", status: "done", confidence: 8 },
        { name: "Search in Rotated Sorted Array II", status: "done", confidence: 8 },
        { name: "Minimum in Rotated Sorted Array", status: "done", confidence: 9 },
        { name: "How Many Times Array is Rotated", status: "done", confidence: 9 },
        { name: "Single Element in Sorted Array", status: "done", confidence: 9 },
        { name: "Find Peak Element", status: "done", confidence: 9 },
        { name: "Find Square Root (BS)", status: "done", confidence: 9 },
        { name: "Find Nth Root of a Number", status: "done", confidence: 9 },
        { name: "Koko Eating Bananas", status: "done", confidence: 9 },
        { name: "Kth Missing Positive Number", status: "done", confidence: 8 },
        { name: "Aggressive Cows", status: "done", confidence: 8 },
        { name: "Book Allocation Problem", status: "done", confidence: 9 },
        { name: "Split Array Largest Sum", status: "done", confidence: 9 },
        { name: "Painter's Partition", status: "done", confidence: 9 },
        { name: "Minimize Max Distance to Gas Station", status: "partial", confidence: 6 },
        { name: "Minimum Days to Make M Bouquets", status: "done", confidence: 9 },
        { name: "Find the Smallest Divisor", status: "done", confidence: 9 },
        { name: "Capacity to Ship Packages Within D Days", status: "done", confidence: 9 },
        { name: "Median of 2 Sorted Arrays", status: "done", confidence: 8 },
        { name: "Kth Element of 2 Sorted Arrays", status: "done", confidence: 9 },
        { name: "Row with Max 1s", status: "done", confidence: 9 },
        { name: "Search in 2D Matrix", status: "done", confidence: 9 },
        { name: "Search in 2D Matrix II", status: "done", confidence: 9 },
        { name: "Find Peak Element II", status: "done", confidence: 9 },
        { name: "Matrix Median", status: "done", confidence: 9 },
        { name: "Find a Peak Element", status: "done", confidence: 9 },
        { name: "Count Negative Numbers in Matrix", status: "done", confidence: 9 },
        { name: "Kth Smallest Element in Sorted Matrix", status: "pending", confidence: 0 },
      ])
    },
    strings: {
      label: "Step 5 · Strings",
      total: 15,
      topics: parseTopics([
        { name: "Remove Outermost Parentheses", status: "pending", confidence: 0 },
        { name: "Reverse Words in a String", status: "done", confidence: 9 },
        { name: "Largest Odd Number in String", status: "done", confidence: 9 },
        { name: "Longest Common Prefix", status: "done", confidence: 9 },
        { name: "Isomorphic Strings", status: "done", confidence: 8 },
        { name: "Check Rotation", status: "done", confidence: 9 },
        { name: "Check Anagram", status: "done", confidence: 9 },
        { name: "Sort Characters by Frequency", status: "pending", confidence: 0 },
        { name: "Longest Palindromic Substring", status: "pending", confidence: 0 },
      ])
    },
    linkedList: {
      label: "Step 6 · Linked List",
      total: 31,
      topics: parseTopics([
        { name: "Introduction to Singly Linked List", status: "done", confidence: 9 },
        { name: "Insertion at the head of Linked List", status: "done", confidence: 9 },
        { name: "Deletion of the head of LL", status: "done", confidence: 9 },
        { name: "Find the length of the Linked List", status: "done", confidence: 9 },
        { name: "Search in Linked List", status: "done", confidence: 8 },
        { name: "Introduction to Doubly LL", status: "done", confidence: 9 },
        { name: "Insert node before head in Doubly LL", status: "done", confidence: 9 },
        { name: "Delete head of Doubly Linked List", status: "done", confidence: 9 },
        { name: "Reverse a Doubly Linked List", status: "done", confidence: 9 },
        { name: "Middle Element of Linked List", status: "done", confidence: 9 },
        { name: "Reverse a Linked List (iterative)", status: "done", confidence: 9 },
        { name: "Reverse a Linked List (recursive)", status: "done", confidence: 9 },
        { name: "Detect Loop in Linked List", status: "done", confidence: 9 },
        { name: "Starting Point of Loop in LL", status: "done", confidence: 9 },
        { name: "Length of Loop in Linked List", status: "done", confidence: 9 },
        { name: "Check if Linked List is Palindrome", status: "done", confidence: 9 },
        { name: "Remove Nth Node from End of LL", status: "done", confidence: 9 },
        { name: "Delete Middle Node of LL", status: "done", confidence: 9 },
        { name: "Merge Two Sorted Linked Lists", status: "done", confidence: 9 },
        { name: "Sort a Linked List", status: "done", confidence: 9 },
        { name: "Sort LL of 0s, 1s and 2s", status: "done", confidence: 9 },
        { name: "Find Intersection Point of Two LLs", status: "done", confidence: 9 },
        { name: "Add 1 to a Number Represented as LL", status: "done", confidence: 9 },
        { name: "Add Two Numbers in LL", status: "done", confidence: 9 },
        { name: "Delete All Occurrences in DLL", status: "done", confidence: 9 },
        { name: "Find Pair Sum in DLL", status: "done", confidence: 9 },
        { name: "Delete Duplicates in Sorted DLL", status: "done", confidence: 9 },
        { name: "Reverse LL in Groups of K", status: "done", confidence: 9 },
        { name: "Rotate a Linked List", status: "done", confidence: 9 },
        { name: "Flattening of a Linked List", status: "done", confidence: 9 },
        { name: "Merge Nodes Between Zeroes", status: "done", confidence: 9 },
        { name: "Partition List", status: "done", confidence: 9 },
        { name: "Remove Duplicates from Sorted List", status: "done", confidence: 9 },
      ])
    },
    recursion: {
      label: "Step 7 · Recursion",
      total: 25,
      topics: parseTopics([
        { name: "Subset Sums", status: "pending", confidence: 0 },
        { name: "Subset Sum II (No Duplicates)", status: "pending", confidence: 0 },
        { name: "Combination Sum I", status: "pending", confidence: 0 },
        { name: "Combination Sum II", status: "pending", confidence: 0 },
        { name: "Permutation Sequence", status: "pending", confidence: 0 },
        { name: "N Queens Problem", status: "pending", confidence: 0 },
        { name: "Sudoku Solver", status: "pending", confidence: 0 },
        { name: "M-Coloring Problem", status: "pending", confidence: 0 },
      ])
    },
    bitManipulation: {
      label: "Step 8 · Bit Manipulation",
      total: 18,
      topics: parseTopics([
        { name: "Check if Bit is Set", status: "pending", confidence: 0 },
        { name: "Set/Clear/Toggle a Bit", status: "pending", confidence: 0 },
        { name: "Check if Number is Odd/Even", status: "pending", confidence: 0 },
        { name: "Check if Power of 2", status: "pending", confidence: 0 },
        { name: "Count Set Bits", status: "pending", confidence: 0 },
        { name: "Find XOR of L to R", status: "pending", confidence: 0 },
      ])
    },
    stacksQueues: {
      label: "Step 9 · Stacks & Queues",
      total: 30,
      topics: parseTopics([
        { name: "Stack using Arrays", status: "pending", confidence: 0 },
        { name: "Queue using Arrays", status: "pending", confidence: 0 },
        { name: "Stack using Queue", status: "pending", confidence: 0 },
        { name: "Queue using Stack", status: "pending", confidence: 0 },
        { name: "Valid Parentheses", status: "pending", confidence: 0 },
        { name: "Next Greater Element", status: "pending", confidence: 0 },
        { name: "Trapping Rainwater", status: "pending", confidence: 0 },
        { name: "Largest Rectangle in Histogram", status: "pending", confidence: 0 },
      ])
    },
    slidingWindow: {
      label: "Step 10 · Sliding Window & Two Pointer",
      total: 12,
      topics: parseTopics([
        { name: "Longest Substring Without Repeat", status: "pending", confidence: 0 },
        { name: "Max Consecutive Ones III", status: "pending", confidence: 0 },
        { name: "Fruit Into Baskets", status: "pending", confidence: 0 },
        { name: "Longest Repeating Character Replacement", status: "pending", confidence: 0 },
        { name: "Binary Subarrays with Sum", status: "pending", confidence: 0 },
        { name: "Count Number of Nice Subarrays", status: "pending", confidence: 0 },
      ])
    },
    heaps: {
      label: "Step 11 · Heaps",
      total: 17,
      topics: parseTopics([
        { name: "Heap Implementation", status: "pending", confidence: 0 },
        { name: "Kth Largest Element", status: "pending", confidence: 0 },
        { name: "Kth Smallest Element", status: "pending", confidence: 0 },
        { name: "Task Scheduler", status: "pending", confidence: 0 },
        { name: "Top K Frequent Elements", status: "pending", confidence: 0 },
      ])
    },
    greedy: {
      label: "Step 12 · Greedy Algorithms",
      total: 16,
      topics: parseTopics([
        { name: "Assign Cookies", status: "pending", confidence: 0 },
        { name: "Jump Game I", status: "pending", confidence: 0 },
        { name: "Jump Game II", status: "pending", confidence: 0 },
        { name: "Job Sequencing Problem", status: "pending", confidence: 0 },
        { name: "N Meetings in One Room", status: "pending", confidence: 0 },
      ])
    },
    binaryTrees: {
      label: "Step 13 · Binary Trees",
      total: 39,
      topics: parseTopics([
        { name: "Inorder Traversal", status: "pending", confidence: 0 },
        { name: "Preorder Traversal", status: "pending", confidence: 0 },
        { name: "Postorder Traversal", status: "pending", confidence: 0 },
        { name: "Level Order Traversal", status: "pending", confidence: 0 },
        { name: "Height of Binary Tree", status: "pending", confidence: 0 },
        { name: "Check Balanced Binary Tree", status: "pending", confidence: 0 },
        { name: "Diameter of Binary Tree", status: "pending", confidence: 0 },
        { name: "Lowest Common Ancestor", status: "pending", confidence: 0 },
      ])
    },
    bst: {
      label: "Step 14 · Binary Search Trees",
      total: 16,
      topics: parseTopics([
        { name: "Search in BST", status: "pending", confidence: 0 },
        { name: "Ceil in BST", status: "pending", confidence: 0 },
        { name: "Floor in BST", status: "pending", confidence: 0 },
        { name: "Insert into BST", status: "pending", confidence: 0 },
        { name: "Delete from BST", status: "pending", confidence: 0 },
        { name: "Validate BST", status: "pending", confidence: 0 },
      ])
    },
    graphs: {
      label: "Step 15 · Graphs",
      total: 53,
      topics: parseTopics([
        { name: "Graph Representation (Matrix/List)", status: "pending", confidence: 0 },
        { name: "BFS Traversal", status: "pending", confidence: 0 },
        { name: "DFS Traversal", status: "pending", confidence: 0 },
        { name: "Detect Cycle in Undirected Graph", status: "pending", confidence: 0 },
        { name: "Detect Cycle in Directed Graph", status: "pending", confidence: 0 },
        { name: "Topological Sort (DFS)", status: "pending", confidence: 0 },
        { name: "Topological Sort (Kahn's BFS)", status: "pending", confidence: 0 },
        { name: "Dijkstra's Algorithm", status: "pending", confidence: 0 },
      ])
    },
    dp: {
      label: "Step 16 · Dynamic Programming",
      total: 56,
      topics: parseTopics([
        { name: "Climbing Stairs", status: "pending", confidence: 0 },
        { name: "Frog Jump", status: "pending", confidence: 0 },
        { name: "House Robber", status: "pending", confidence: 0 },
        { name: "Ninja's Training", status: "pending", confidence: 0 },
        { name: "Grid Unique Paths", status: "pending", confidence: 0 },
        { name: "0/1 Knapsack", status: "pending", confidence: 0 },
        { name: "Longest Common Subsequence", status: "pending", confidence: 0 },
        { name: "Longest Increasing Subsequence", status: "pending", confidence: 0 },
      ])
    },
    tries: {
      label: "Step 17 · Tries",
      total: 7,
      topics: parseTopics([
        { name: "Implement Trie (Insert, Search)", status: "pending", confidence: 0 },
        { name: "Implement Trie II", status: "pending", confidence: 0 },
        { name: "Longest String with All Prefixes", status: "pending", confidence: 0 },
        { name: "Number of Distinct Substrings", status: "pending", confidence: 0 },
        { name: "Maximum XOR with Element from Array", status: "pending", confidence: 0 },
      ])
    },
    stringsAdv: {
      label: "Step 18 · Strings (Advanced)",
      total: 9,
      topics: parseTopics([
        { name: "KMP Algorithm", status: "pending", confidence: 0 },
        { name: "Minimum Characters for Palindrome", status: "pending", confidence: 0 },
        { name: "Check if Strings are Rotations", status: "pending", confidence: 0 },
        { name: "Count Palindromic Substrings", status: "pending", confidence: 0 },
      ])
    }
  },
  
  weeks: [
    {
      label: "Week 15",
      range: "Aug 3 – Aug 9",
      average: 9.0,
      days: [
        { date: "Aug 3", day: "Mon", topic: "DSA: Flattening of a Linked List (Hard) ✓ · 🎓 First day of college", rating: 9, mood: 4, hours: 2 },
        { date: "Aug 4", day: "Tue", topic: "DSA: Isomorphic String ✓ (Strings) · College day — 1hr", rating: 8, mood: 3, hours: 1 },
        { date: "Aug 5", day: "Wed", topic: "Rest day 🧊", rating: null, mood: 3, hours: 0 },
        { date: "Aug 6", day: "Thu", topic: "DSA: Merge Two Sorted LL ✓, Merge Nodes Between Zeroes ✓ · Backend: MongoDB fundamentals revision ✓, Mongoose installation ✓, Schema & Model creation ✓", rating: 10, mood: 5, hours: 4 },
        { date: "Aug 7", day: "Fri", topic: "DSA: Largest Odd Number in String ✓ · Backend: Built CRUD endpoints with MongoDB ✓", rating: 9, mood: 4, hours: 3 },
        { date: "Aug 8", day: "Sat", topic: "DSA: Merge Overlapping Subintervals ✓ · Backend: Posts route — built & features learned ✓", rating: 8, mood: 5, hours: 3 },
        { date: "Aug 9", day: "Sun", topic: "DSA: Partition List ✓, Remove Duplicates from Sorted List ✓ · Backend: MongoDB Middleware started ✓, Blog API example ✓ · Hackathon vibe coding project 🚀", rating: 10, mood: 4, hours: 5 },
      ]
    },
    {
      label: "Week 13",
      range: "Jul 22 – Jul 28",
      average: 8.7,
      days: [
        { date: "Jul 22", day: "Wed", topic: "DSA: Add 1 to a Number Represented as LL ✓ · Backend: Auth built — validator, controller, route (JWT + bcrypt) ✓", rating: 10, mood: 5, hours: 4 },
        { date: "Jul 23", day: "Thu", topic: "DSA: Add Two Numbers in LL (Medium) ✓ · Backend: Authentication Middleware (JWT) ✓", rating: 9, mood: 4, hours: 3 },
        { date: "Jul 24", day: "Fri", topic: "No DSA · Backend: Task Manager API COMPLETED & pushed to GitHub 🎉", rating: 9, mood: 5, hours: 4 },
        { date: "Jul 25", day: "Sat", topic: "DSA: Delete All Occurrences of a Number in DLL ✓ · Backend: MongoDB Atlas setup ✓, Terminology ✓, MongoDB Compass ✓", rating: 9, mood: 4, hours: 3 },
        { date: "Jul 26", day: "Sun", topic: "No DSA · Backend: CRUD in MongoDB ✓, Connecting Atlas to Compass ✓", rating: 8, mood: 3, hours: 2 },
        { date: "Jul 27", day: "Mon", topic: "DSA: Find Pair Sum in DLL ✓ · Backend: MongoDB commands deep dive ✓, Testing on sample DB ✓", rating: 9, mood: 4, hours: 3 },
        { date: "Jul 28", day: "Tue", topic: "DSA: Delete Duplicates in Sorted DLL ✓ · Last free day before college 🎓", rating: 7, mood: 3, hours: 2 },
      ]
    },
    {
      label: "Week 12",
      range: "Jul 15 – Jul 21",
      average: 9.3,
      days: [
        { date: "Jul 15", day: "Wed", topic: "Rest day — light project work 🧊", rating: null, mood: 3, hours: 0 },
        { date: "Jul 16", day: "Thu", topic: "DSA: Remove Nth Node from Tail of LL ✓ · Backend: Users API completed", rating: 10, mood: 5, hours: 4 },
        { date: "Jul 17", day: "Fri", topic: "No DSA · Backend: Tasks API (halfway)", rating: 8, mood: 4, hours: 2 },
        { date: "Jul 18", day: "Sat", topic: "DSA: Delete Middle Node of LL ✓ · Backend: Tasks API completed ✓", rating: 9, mood: 4, hours: 3 },
        { date: "Jul 19", day: "Sun", topic: "DSA: Merge Two Sorted Linked Lists ✓ · Backend: Sorting & Filtering in APIs ✓", rating: 9, mood: 4, hours: 3 },
        { date: "Jul 20", day: "Mon", topic: "DSA: Sort a Linked List ✓, Sort LL of 0s 1s and 2s ✓ · Backend: Search & Pagination in endpoints ✓", rating: 10, mood: 5, hours: 4 },
        { date: "Jul 21", day: "Tue", topic: "DSA: Find Intersection Point of Two LLs ✓ · Backend: Revamped all validators ✓, Auth started", rating: 10, mood: 5, hours: 5 },
      ]
    }
  ],

  schedule: [
    { day: "Monday", type: "College 8:00 AM – 12:20 PM", hours: "4h 20m", commute: "2h 30m total", dsaSlot: "6:30–8:00 PM (1–2 probs)", backendSlot: "8:00–9:30 PM" },
    { day: "Tuesday", type: "College 8:00 AM – 3:20 PM", hours: "7h 20m", commute: "2h 40m total", dsaSlot: "7:00–8:00 PM (1 prob min)", backendSlot: "8:00–9:00 PM" },
    { day: "Wednesday", type: "College 9:00 AM – 12:20 PM", hours: "3h 20m", commute: "2h 30m total", dsaSlot: "6:00–7:30 PM (1–2 probs)", backendSlot: "7:30–9:00 PM" },
    { day: "Thursday", type: "College 1:40 PM – 5:00 PM", hours: "3h 20m", commute: "2h 10m total", dsaSlot: "8:00–11:00 AM (2 probs)", backendSlot: "11:00–1:00 PM" },
    { day: "Friday", type: "College 9:00 AM – 1:00 PM", hours: "4h", commute: "2h 30m total", dsaSlot: "6:00–8:00 PM (1–2 probs)", backendSlot: "8:00–9:30 PM" },
    { day: "Saturday", type: "Full study day", hours: "0h", commute: "0h", dsaSlot: "10:00 AM–1:00 PM (2–3 probs)", backendSlot: "2:00–5:00 PM (deep work)" },
    { day: "Sunday", type: "Full study day", hours: "0h", commute: "0h", dsaSlot: "10:00 AM–1:00 PM (2–3 probs)", backendSlot: "2:00–5:00 PM (projects)" },
  ],

  backendRoadmap: [
    {
      id: "ph0", week: "Phase 0", label: "JavaScript Foundation", period: "Jun 11 – Jul 1", status: "done",
      topics: ["Variables, Data Types, Functions", "Arrays, Objects, Strings", "Loops, Conditionals, Control Flow", "Destructuring, Spread/Rest, Modules", "Promises, async/await, Error Handling", "IIFE, Scope, Arrow Functions"],
      project: null
    },
    {
      id: "wk1", week: "Week 1", label: "Node.js + Express + REST", period: "Jul 1 – Jul 7", status: "done",
      topics: ["Node.js internals, npm, package.json", "fs & path module, Environment Variables", "Async vs Sync, Express.js", "Middleware (definition, types, syntax)", "Controllers, File/Project structure", "REST, HTTP Methods, Postman"],
      project: { name: "Inventory Management API", url: "https://github.com/Aman06-10/inventory-management-api", desc: "CRUD API with Express, in-memory + fs" }
    },
    {
      id: "wk2", week: "Week 2", label: "PostgreSQL + Backend Architecture", period: "Jul 8 – Jul 24", status: "done",
      topics: ["PostgreSQL intro, SELECT, INSERT, CRUD", "GROUP BY, HAVING, Aggregate functions", "Foreign Keys, Referential Integrity", "JOINs, Relations", "Sorting, Filtering, Search, Pagination", "JWT + bcrypt"],
      project: { name: "Task Manager API", url: "https://github.com/Aman06-10/task-manager-api", desc: "Full auth, CRUD, pagination, validation, PostgreSQL" }
    },
    {
      id: "wk3", week: "Week 3", label: "MongoDB + Authentication + Security", period: "Jul 25 – Aug ongoing", status: "partial",
      topics: ["MongoDB Atlas setup, Compass", "CRUD in MongoDB", "Mongoose installation, Schema & Model creation", "JWT + bcrypt (already done in Week 2)", "RBAC, helmet, rate limiting — pending"],
      project: null
    },
    {
      id: "wk4", week: "Week 4", label: "Production Features", period: "Aug – upcoming", status: "pending",
      topics: ["Multer (file uploads)", "Cloudinary", "Nodemailer", "Password Reset", "Swagger / OpenAPI"],
      project: null
    },
    {
      id: "wk5", week: "Weeks 5–6", label: "Major Resume Project", period: "Aug – upcoming", status: "pending",
      topics: ["Auth, CRUD, Pagination", "Validation, Search", "Role permissions, Activity logs", "File uploads", "Deploy API"],
      project: null
    }
  ]
};
function processHierarchies(data) {
    const invalid_entries = [];
    const duplicate_edges_set = new Set();
    const seen_edges = new Set();
    const accepted_edges = [];

    // 1. Validate and find duplicates
    for (const item of data) {
        if (typeof item !== 'string') {
            invalid_entries.push(item);
            continue;
        }

        const trimmed = item.trim();
        const validFormat = /^[A-Z]->[A-Z]$/.test(trimmed);

        if (!validFormat) {
            invalid_entries.push(item);
            continue;
        }

        if (seen_edges.has(trimmed)) {
            duplicate_edges_set.add(trimmed);
        } else {
            seen_edges.add(trimmed);
            const [parent, child] = trimmed.split('->');
            accepted_edges.push({ parent, child, original: trimmed });
        }
    }

    // 2. Discard multi-parents
    const child_to_parent = new Map();
    const valid_edges = [];
    
    for (const { parent, child, original } of accepted_edges) {
        if (!child_to_parent.has(child)) {
            child_to_parent.set(child, parent);
            valid_edges.push({ parent, child });
        }
    }

    // 3. Find Connected Components
    const adj = new Map(); // undirected adjacency for components
    const directed_adj = new Map(); // directed adjacency for trees
    const in_degree = new Map();
    const nodes = new Set();

    // Initialize structures
    for (const { parent, child } of valid_edges) {
        nodes.add(parent);
        nodes.add(child);
        
        if (!adj.has(parent)) adj.set(parent, []);
        if (!adj.has(child)) adj.set(child, []);
        adj.get(parent).push(child);
        adj.get(child).push(parent);
        
        if (!directed_adj.has(parent)) directed_adj.set(parent, []);
        if (!directed_adj.has(child)) directed_adj.set(child, []);
        directed_adj.get(parent).push(child);
        
        if (!in_degree.has(parent)) in_degree.set(parent, 0);
        if (!in_degree.has(child)) in_degree.set(child, 0);
        in_degree.set(child, in_degree.get(child) + 1);
    }

    const visited = new Set();
    const components = [];

    for (const node of nodes) {
        if (!visited.has(node)) {
            const component_nodes = [];
            const queue = [node];
            visited.add(node);
            
            while (queue.length > 0) {
                const curr = queue.shift();
                component_nodes.push(curr);
                
                const neighbors = adj.get(curr) || [];
                for (const neighbor of neighbors) {
                    if (!visited.has(neighbor)) {
                        visited.add(neighbor);
                        queue.push(neighbor);
                    }
                }
            }
            components.push(component_nodes);
        }
    }

    // 4. Process each component
    const hierarchies = [];
    let total_trees = 0;
    let total_cycles = 0;
    let largest_tree_root = null;
    let max_depth = 0;

    for (const comp of components) {
        // Find roots in this component
        const comp_roots = comp.filter(node => in_degree.get(node) === 0);

        if (comp_roots.length === 0) {
            // Pure cycle
            comp.sort(); // Lexicographically sort
            const smallest = comp[0];
            hierarchies.push({
                root: smallest,
                tree: {},
                has_cycle: true
            });
            total_cycles++;
        } else {
            // It's a tree (since max in-degree is 1, exactly 1 root per tree component)
            // Wait, if it's a connected component and max in-degree is 1, there can only be 1 root.
            const root = comp_roots[0];
            
            // Build tree structure and calculate depth
            let depth = 0;
            
            function buildTree(node, currentDepth) {
                depth = Math.max(depth, currentDepth);
                const treeObj = {};
                const children = directed_adj.get(node) || [];
                // Sort children lexicographically just for consistent output, though not strictly required
                children.sort();
                for (const child of children) {
                    treeObj[child] = buildTree(child, currentDepth + 1);
                }
                return treeObj;
            }

            const treeData = buildTree(root, 1);
            
            hierarchies.push({
                root: root,
                tree: { [root]: treeData },
                depth: depth
            });
            
            total_trees++;
            
            if (depth > max_depth) {
                max_depth = depth;
                largest_tree_root = root;
            } else if (depth === max_depth && largest_tree_root) {
                if (root < largest_tree_root) {
                    largest_tree_root = root;
                }
            }
        }
    }

    return {
        hierarchies,
        invalid_entries,
        duplicate_edges: Array.from(duplicate_edges_set),
        summary: {
            total_trees,
            total_cycles,
            largest_tree_root
        }
    };
}

module.exports = {
    processHierarchies
};

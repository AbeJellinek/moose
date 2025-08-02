export function groupBy<K, V>(values: Iterable<V>, groupFn: (value: V) => K): Map<K, V[]> {
    let map = new Map<K, V[]>();
    for (let value of values) {
        let key = groupFn(value);
        if (!map.has(key)) {
            map.set(key, []);
        }
        map.get(key)!.push(value);
    }
    return map;
}

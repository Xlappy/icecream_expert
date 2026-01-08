const fetch = require('node-fetch');

async function testSearch() {
    try {
        const res = await fetch('http://localhost:3000/api/search?q=Vanila');
        const data = await res.json();
        console.log('Search Results:', data);
    } catch (e) {
        console.error('Server is not reachable');
    }
}

testSearch();

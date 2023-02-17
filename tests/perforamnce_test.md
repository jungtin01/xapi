ab -T application/json  -H 'authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTYwMjQ0MTI0LCJleHAiOjE1NjAzMDE3MjR9.VZau8NVfDDTFKE_D0FPBp80J6_ed0_EZA0318P52ORw' -c 10 -n 2000 http://localhost:3003/api/my-profile

ab -p abdata.json -T application/json -H 'authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTYwMjQ0MTI0LCJleHAiOjE1NjAzMDE3MjR9.VZau8NVfDDTFKE_D0FPBp80J6_ed0_EZA0318P52ORw' -c 1 -n 2000 http://localhost:3003/api/request

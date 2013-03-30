{
    "listen": 80,
    "rules": [
        {
            "match": {
                "path": "/elasticsearch"
            },
            "pool": {
                "type":  "static",
                "hosts": ["localhost:9200"]
            }
        },
        {
            "match": {
                "vhost": "www.blackboxsociety.com"
            },
            "routing": {
                "method": "random"
            },
            "pool": {
                "type":  "static",
                "hosts": ["172.16.8.130"]
            }
        },
        {
            "match": {
                "vhost": "www.plasmaconduit.com"
            },
            "routing": {
                "method": "hash-cookie",
                "param":  "mount"
            },
            "pool": {
                "type":  "zookeeper",
                "hosts": ["localhost:2181"],
                "path":  "/plasma/web"
            }
        }
    ]
}

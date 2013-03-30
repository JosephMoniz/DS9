DS9
===
DS9 is a HTTP load balancer, it supports both HTTP and WebSocket routing.
For the most part, DS9 supports most of the features you'd expect in a
modern intelligent load balancer. It's able to perform routing based off
of a number of configurable parameters such as vhost, request path, request
type, get/post variables and cookie values. Also like most off the shelf
load balancers DS9 has support for multiple load balancing algorithms
such as `round-robin`, `random`, `least-connections`, `hash-cookie`,
`hash-get-param`, `hash-post-param`, `hash-path`

What makes DS9 stand out from the crowd is that it's ZooKeeper aware out
of the box. Meaning that as web nodes come online all they have to do to
join the active load balancing roster is register with ZooKeeper and DS9
will take care of the rest. DS9 also has the ability to track and manage
multiple web node rosters via ZooKeeper allowing you to dynamically scale
up and scale down isolated web tiers independently just by spinning nodes
up and spinning nodes down.

Along with the super awesome ZooKeeper driven host rosters, DS9 also suppots
static host rosters if you're into that kind of thing.

Disclaimer
----------
This is a working prototype at the moment, all route matching functionality
works and most load balancing algorithms are working. I however must warn you
that as this isn't a fully tested system, i can make no solid promises on
actual reliability at the moment. Expect a comprehensive test suite soon.

Example
-------
Config:
```javascript
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

```

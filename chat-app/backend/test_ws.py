import asyncio
import websockets
import json

async def test_ws():
    # We need a token. Let's hit the login endpoint or register a fake user.
    import httpx
    
    async with httpx.AsyncClient() as client:
        # Register user1
        res1 = await client.post("http://localhost:8000/api/auth/register", json={
            "username": "testuser1",
            "email": "test1@test.com",
            "password": "password123"
        })
        # Ignore if exists
        
        # Login user1
        res1 = await client.post("http://localhost:8000/api/auth/login", data={
            "username": "test1@test.com",
            "password": "password123"
        })
        token1 = res1.json().get("access_token")
        
        # Register user2
        res2 = await client.post("http://localhost:8000/api/auth/register", json={
            "username": "testuser2",
            "email": "test2@test.com",
            "password": "password123"
        })
        
        # Login user2
        res2 = await client.post("http://localhost:8000/api/auth/login", data={
            "username": "test2@test.com",
            "password": "password123"
        })
        token2 = res2.json().get("access_token")
        
        # Get users
        res_users = await client.get("http://localhost:8000/api/users", headers={"Authorization": f"Bearer {token1}"})
        users = res_users.json()
        print(f"Users response: {users}")
        if isinstance(users, list):
            u2 = next(u for u in users if u["username"] == "testuser2")
            u2_id = u2["id"]
        else:
            print("Failed to get users list")
            return
            
        print(f"User2 ID: {u2_id}")

        async with websockets.connect(f"ws://localhost:8000/ws/chat?token={token1}") as ws:
            print("Connected to WS")
            
            # Send message
            msg = {
                "type": "message",
                "receiver_id": u2_id,
                "content": "Hello world!"
            }
            await ws.send(json.dumps(msg))
            print("Message sent")
            
            # Receive response
            resp = await ws.recv()
            print(f"Received: {resp}")

if __name__ == "__main__":
    asyncio.run(test_ws())

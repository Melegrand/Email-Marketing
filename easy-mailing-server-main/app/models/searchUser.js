class UserFetcher {
    constructor(client) {
        this.client = client;
    }

    async getUserById(id) {
        try {
            const userRequest = await this.client.query('SELECT * FROM "user" WHERE id = $1', [id]);

            if (userRequest.rowCount > 0) {
                return userRequest.rows[0];
            } else {
                res.status(500)
            }
        } catch (error) {
            console.error(error)
            res.status(500)
        }
    }
}
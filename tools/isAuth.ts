import * as express from 'express'

export function isAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (!req.session.loggedin) {
        res.redirect('/users/login')
    } else {
        req.db.get(`
            SELECT session_control
            FROM users
            WHERE id=?
        `, [req.session.user_id], (err, row) => {
            if (err) {
                console.log(err)
                res.render('error', { message: 'Authorization failed' })
            } else {
                if (row.session_control !== req.session.session_control) {
                    delete (req.session.loggedin)
                    delete (req.session.user_id)
                    delete (req.session.username)
                    res.redirect('/users/login')
                } else {
                    next()
                }
            }
        })
    }
}
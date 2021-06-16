//ici fonction de haut niveau qui gere les erreurs

export const catchErrors = fn => (req, res, next) => {
    return fn(req, res, next).catch(next)
}
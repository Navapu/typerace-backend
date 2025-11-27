export const slugFromEmail = (e) => String(e || 'canal').split('@')[0].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

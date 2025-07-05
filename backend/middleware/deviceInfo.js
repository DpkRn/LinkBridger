const geoip= require('geoip-lite');
const  useragent=require('useragent');

const extractInfo=(req,res,next)=>{
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const geo = geoip.lookup(ip) || { city: "Unknown", country: "Unknown" };
    const agent = useragent.parse(req.headers['user-agent']);
    const browser = agent.toAgent();

    // Get current time
    const visitTime = new Date().toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' });

    // Prepare details
    const details = {
        ip:ip,
        city: geo.city || "Unknown",
        country: geo.country || "Unknown",
        browser: browser,
        time: visitTime,
    };
    req.details=details

    // Send email notification
    // console.log(details)

    return next()
}
module.exports={
 extractInfo
}
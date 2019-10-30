using Microsoft.AspNetCore.Mvc;

namespace Cabinizer.Controllers
{
    [ApiController]
    public abstract class ApiController : ControllerBase
    {
        public new CabinizerPrincipal User => new CabinizerPrincipal(base.User);
    }

}
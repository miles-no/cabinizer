using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Cabinizer.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Cabinizer.Controllers
{
    [Route("items")]
    public class ItemController : ApiController
    {
        public ItemController(CabinizerContext context)
        {
            Context = context;
        }

        private CabinizerContext Context { get; }

        [HttpGet]
        public async Task<ActionResult<IReadOnlyCollection<Cabin>>> GetAll(CancellationToken cancellationToken)
        {
            return Ok(await Context.Cabins.Where(x => User.OrgUnitPath.StartsWith(x.OrganizationUnitPath)).ToListAsync(cancellationToken));
        }
    }
}

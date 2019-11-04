using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Cabinizer.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Cabinizer.Controllers
{
    [Route("orgunits")]
    public class OrganizationUnitController : ApiController
    {
        public OrganizationUnitController(CabinizerContext context)
        {
            Context = context;
        }

        private CabinizerContext Context { get; }

        [HttpGet]
        public async Task<ActionResult<IReadOnlyCollection<OrganizationUnit>>> GetAllOrgUnits(CancellationToken cancellationToken)
        {
            return Ok(await Context.OrganizationUnits.ToListAsync(cancellationToken));
        }
    }
}
